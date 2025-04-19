import {
  ComponentType,
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IMatrix, Matrix } from "transformation-matrix-js";
import type {
  Region,
} from "../types/region-tools.ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreventScrollToParents from "../PreventScrollToParents/index.tsx";
import useWindowSize from "../hooks/use-window-size.tsx";
import useMouse from "./use-mouse.ts";
import useProjectRegionBox from "./use-project-box.ts";
import useExcludePattern from "../hooks/use-exclude-pattern.tsx";
import { useRafState } from "react-use";
import RegionTags from "../RegionTags/index.tsx";
import { RegionLabelProps } from "../RegionLabel/index.tsx";
import ImageMask from "../ImageMask/index.tsx";
import ImageCanvasBackground from "../ImageCanvasBackground/index.tsx";
import useEventCallback from "use-event-callback";
import RegionShapes from "../RegionShapes/index.tsx";
import { ImagePosition } from "../types/common.ts";
import { tss } from "tss-react/mui";

const theme = createTheme();
const useStyles = tss.create({
  canvas: {height: "100%", width: "100%", position: "relative", zIndex: 1 },
  zoomIndicator: {
    position: "absolute",
    bottom: 16,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    opacity: 0.5,
    fontWeight: "bolder",
    fontSize: 14,
    padding: 4,
  },
  fixedRegionLabel: {
    position: "absolute",
    zIndex: 10,
    top: 10,
    left: 10,
    opacity: 0.5,
    transition: "opacity 500ms",
    "&:hover": {
      opacity: 1,
    },
  },
});

type Props = {
  regions: Array<Region>;
  imageSrc: string | null;
  onMouseMove?: (point: { x: number; y: number }) => any;
  onMouseDown?: (point: { x: number; y: number }) => any;
  onMouseUp?: (point: { x: number; y: number }) => any;
  regionClsList?: Array<string | { id: string; label: string; color: string }>;
  regionTagList?: Array<string>;
  allowedArea?: { x: number; y: number; w: number; h: number };
  RegionEditLabel?:
    | ComponentType<RegionLabelProps>
    | FunctionComponent<RegionLabelProps>
    | null;
  zoomOnAllowedArea?: boolean;
  allowComments?: boolean;
  onChangeRegion: (region: Region) => void;
  onBeginRegionEdit: (region: Region) => void;
  onCloseRegionEdit: (region: Region) => void;
  onDeleteRegion: (region: Region) => void;
  onImageLoaded: (props: {
    naturalWidth: number;
    naturalHeight: number;
    duration?: number;
  }) => void;
  onRegionClassAdded: (cls: string) => void;
};

export type CanvasLayoutParams = {
  iw: number;
  ih: number;
  fitScale: number;
  canvasWidth: number;
  canvasHeight: number;
};

type PointArray = [number, number];

const getDefaultMat: IMatrix = (
  allowedArea: { x: number; y: number; w: number; h: number } | null = null,
  offset: CanvasLayoutParams | null = null
) => {
  if (!offset) return Matrix.from(1, 0, 0, 1, 0, 0);

  const { iw, ih, canvasWidth, canvasHeight } = offset;

  // Calculate how much space is left after scaling the image
  const dx = (canvasWidth - iw) / 2;
  const dy = (canvasHeight - ih) / 2;

  let mat = Matrix.from(1, 0, 0, 1, -1*dx, -1*dy);

  if (allowedArea) {
    mat = mat
      .translate(allowedArea.x * iw, allowedArea.y * ih)
      .scaleU(allowedArea.w + 0.05);
  }

  return mat;
};


export const ModifiedCanvas = ({
  regions,
  imageSrc,
  onMouseMove = () => null,
  onMouseDown = () => null,
  onMouseUp = () => null,
  regionClsList,
  regionTagList,
  allowedArea,
  RegionEditLabel = null,
  onImageLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onDeleteRegion,
  onRegionClassAdded,
  zoomOnAllowedArea = true,
  allowComments,
}: Props) => {
  const { classes } = useStyles();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);
  const layoutParams = useRef<CanvasLayoutParams | null>(null);
  const [dragging, changeDragging] = useRafState(false);
  // const [maskImagesLoaded, changeMaskImagesLoaded] = useRafState(0);
  const [zoomStart, changeZoomStart] = useRafState<{
    x: number;
    y: number;
  } | null>(null);
  const [zoomEnd, changeZoomEnd] = useRafState<{ x: number; y: number } | null>(
    null
  );
  const [mat, changeMat] = useRafState<IMatrix>(getDefaultMat());
  // const maskImages = useRef({});
  const windowSize = useWindowSize();

  const { mouseEvents } = useMouse({
    canvasEl,
    dragging,
    mat,
    layoutParams,
    changeMat,
    zoomStart,
    zoomEnd,
    changeZoomStart,
    changeZoomEnd,
    changeDragging,
    zoomWithPrimary: false,
    dragWithPrimary: true,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  });

  useLayoutEffect(() => changeMat(mat.clone()), [windowSize]);
  const [imageDimensions, changeImageDimensions] = useState<{
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth);
  const projectRegionBox = useProjectRegionBox({ layoutParams, mat });

  const onImgLoaded = useEventCallback(
    ({
      naturalWidth,
      naturalHeight,
      duration,
    }: {
      naturalWidth: number;
      naturalHeight: number;
      duration?: number;
    }) => {
      const dims = { naturalWidth, naturalHeight, duration };
      if (onImageLoaded) onImageLoaded(dims);
      changeImageDimensions(dims);
      // Redundant update to fix rerendering issues
      setTimeout(() => changeImageDimensions(dims), 10);
    }
  );

  const excludePattern = useExcludePattern();

  const canvas = canvasEl.current;

  if (canvas && imageLoaded && imageDimensions) {
    const { clientWidth, clientHeight } = canvas;

    const fitScale = Math.max(
      imageDimensions.naturalWidth / (clientWidth - 20),
      imageDimensions.naturalHeight / (clientHeight - 20)
    );

    const [iw, ih] = [
      imageDimensions.naturalWidth / fitScale,
      imageDimensions.naturalHeight / fitScale,
    ];
    layoutParams.current = {
      iw,
      ih,
      fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight,
    };
  }

  useEffect(() => {
    if (!imageLoaded) return;
    changeMat(
      getDefaultMat(
        zoomOnAllowedArea ? allowedArea : null,
        layoutParams.current
      )
    );
    // eslint-disable-next-line
  }, [imageLoaded]);

  // this is done to move the regiontag near the bounding box initially
  useEffect(() => {
    if (!imageLoaded || !canvas) return;
    const x = canvas.width / 2;
    const y = canvas.height / 2;
  
    const mousedown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      view: window,
    });
  
    const mouseup = new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      view: window,
    });
  
    // Step 1: Hold down the mouse
    canvas.dispatchEvent(mousedown);
  
    // Step 2: Release after 100ms
    setTimeout(() => {
      canvas.dispatchEvent(mouseup);
    }, 10);
  }, [imageLoaded, canvas]);
  

  useLayoutEffect(() => {
    if (!imageDimensions || !canvas) return;
    const { clientWidth, clientHeight } = canvas;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.save();
    const inversed = mat.clone().inverse().toArray();
    context.transform(
      inversed[0],
      inversed[1],
      inversed[2],
      inversed[3],
      inversed[4],
      inversed[5]
    );

    const iw = layoutParams.current?.iw || 0;
    const ih = layoutParams.current?.ih || 0;

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      const { x, y, w, h } = allowedArea;
      context.save();
      context.globalAlpha = 1;
      const outer: Array<PointArray> = [
        [0, 0],
        [iw, 0],
        [iw, ih],
        [0, ih],
      ];
      const inner: Array<PointArray> = [
        [x * iw, y * ih],
        [x * iw + w * iw, y * ih],
        [x * iw + w * iw, y * ih + h * ih],
        [x * iw, y * ih + h * ih],
      ];
      context.moveTo(...outer[0]);
      outer.forEach((p) => context.lineTo(...p));
      context.lineTo(...outer[0]);
      context.closePath();

      inner.reverse();
      context.moveTo(...inner[0]);
      inner.forEach((p) => context.lineTo(...p));
      context.lineTo(...inner[0]);

      context.fillStyle = excludePattern || "#f00";
      context.fill();

      context.restore();
    }

    context.restore();
  });

  let zoomBox =
    !zoomStart || !zoomEnd
      ? null
      : {
          ...mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y),
          w: (zoomEnd.x - zoomStart.x) / mat.a,
          h: (zoomEnd.y - zoomStart.y) / mat.d,
        };
  if (zoomBox) {
    if (zoomBox.w < 0) {
      zoomBox.x += zoomBox.w;
      zoomBox.w *= -1;
    }
    if (zoomBox.h < 0) {
      zoomBox.y += zoomBox.h;
      zoomBox.h *= -1;
    }
  }

  const imagePosition: ImagePosition | null = layoutParams.current
    ? {
        topLeft: mat.clone().inverse().applyToPoint(0, 0),
        bottomRight: mat
          .clone()
          .inverse()
          .applyToPoint(layoutParams.current.iw, layoutParams.current.ih),
      }
    : null;

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "calc(100vh - 68px)",
          position: "relative",
          overflow: "hidden",
          cursor:  dragging
            ? "grabbing"
            :  "grab",
        }}
      >
        {imageLoaded && !dragging && (
          <PreventScrollToParents key="regionTags">
            <RegionTags
              regions={regions}
              projectRegionBox={projectRegionBox}
              mouseEvents={mouseEvents}
              regionClsList={regionClsList}
              regionTagList={regionTagList}
              regionTagSingleSelection={false}
              onBeginRegionEdit={onBeginRegionEdit}
              onChangeRegion={onChangeRegion}
              onCloseRegionEdit={onCloseRegionEdit}
              onDeleteRegion={onDeleteRegion}
              RegionEditLabel={RegionEditLabel}
              onRegionClassAdded={onRegionClassAdded}
              allowComments={allowComments}
            />
          </PreventScrollToParents>
        )}
        <PreventScrollToParents
          style={{ width: "100%", height: "100%" }}
          {...mouseEvents}
        >
          {imagePosition ? (
            <ImageMask
              hide={false}
              autoSegmentationOptions={{ type: "autoseg" }}
              imagePosition={imagePosition}
              regionClsList={regionClsList?.map((c) =>
                typeof c === "string" ? c : c.id
              )}
              imageSrc={imageSrc}
              regions={regions}
            />
          ) : null}
          <canvas
            style={{ opacity: 0.25 }}
            className={classes.canvas}
            ref={canvasEl}
          />
          <RegionShapes
            imagePosition={imagePosition}
            regions={regions}
          />
          <ImageCanvasBackground
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            onLoad={onImgLoaded}
            imageSrc={imageSrc}
          />
        </PreventScrollToParents>
        <div className={classes.zoomIndicator}>
          {((1 / mat.a) * 100).toFixed(0)}%
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ModifiedCanvas;
