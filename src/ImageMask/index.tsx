// @flow

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useDebounce } from "react-use";
import loadImage from "./load-image";
import autoseg, { AutosegConfig } from "autoseg/webworker";
import { Region } from "../types/region-tools.ts";
import { ImagePosition } from "../types/common.ts";

function convertToUDTRegions(regions: Region[]) {
  return regions
    .map((r) => {
      switch (r.type) {
        case "point": {
          return {
            regionType: "point",
            classification: r.cls,
            x: r.x,
            y: r.y,
          };
        }
        case "polygon": {
          return {
            regionType: "polygon",
            classification: r.cls,
            points: r.points.map(([x, y]) => ({ x, y })),
          };
        }
        case "box": {
          return {
            regionType: "bounding-box",
            classification: r.cls,
            centerX: r.x + r.w / 2,
            centerY: r.y + r.h / 2,
            width: r.w,
            height: r.h,
          };
        }
        default: {
          return null;
        }
      }
    })
    .filter(Boolean);
}

type ImageMaskProp = {
  regions: Region[];
  regionClsList?: string[];
  imageSrc: string | null;
  imagePosition: ImagePosition;
  zIndex?: number;
  hide?: boolean;
  autoSegmentationOptions?: Omit<AutosegConfig, "classNames">;
};

export const ImageMask = ({
  regions,
  regionClsList,
  imageSrc,
  imagePosition,
  zIndex = 5,
  hide = false,
  autoSegmentationOptions = { type: "simple" },
}: ImageMaskProp) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  const [sampleImageData, setSampleImageData] = useState<ImageData | null>(
    null
  );
  useEffect(() => {
    if (!imageSrc) return;
    loadImage(imageSrc).then((imageData) => {
      autoseg.setConfig({
        classNames: regionClsList ?? [],
        ...autoSegmentationOptions,
      });
      autoseg.loadImage(imageData);
      setSampleImageData(imageData);
    });
  }, [imageSrc]);

  useDebounce(
    () => {
      if (hide) return;
      if (!canvasRef) return;
      if (!sampleImageData) return;
      if (regions.filter((cp) => cp.cls).length < 2) return;

      const udtRegions = convertToUDTRegions(regions);

      autoseg.getMask(udtRegions).then((maskImageData) => {
        const context = canvasRef.getContext("2d");
        if (context) {
          context.clearRect(0, 0, maskImageData.width, maskImageData.height);
          context.putImageData(maskImageData, 0, 0);
        }
      });
    },
    1000,
    [canvasRef, sampleImageData, regions, hide]
  );

  const style: CSSProperties = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x;
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y;
    return {
      display: hide ? "none" : undefined,
      imageRendering: "pixelated",
      transform: "translateZ(0px)",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      zIndex,
      position: "absolute",
      pointerEvents: "none",
    };
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
    zIndex,
    hide,
  ]);

  return (
    <canvas
      id="autoseg"
      style={style}
      width={sampleImageData ? sampleImageData.width : 0}
      height={sampleImageData ? sampleImageData.height : 0}
      ref={setCanvasRef}
    />
  );
};

export default ImageMask;
