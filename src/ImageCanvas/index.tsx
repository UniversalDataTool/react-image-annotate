// @flow weak

import {
  ComponentType,
  FunctionComponent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IMatrix, Matrix } from "transformation-matrix-js";
import Crosshairs from "../Crosshairs";
import type {
  Box,
  Keypoints,
  KeypointsDefinition,
  Point,
  Polygon,
  Region,
} from "../types/region-tools.ts";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreventScrollToParents from "../PreventScrollToParents";
import useWindowSize from "../hooks/use-window-size.tsx";
import useMouse from "./use-mouse";
import useProjectRegionBox from "./use-project-box";
import useExcludePattern from "../hooks/use-exclude-pattern";
import { useRafState } from "react-use";
import PointDistances from "../PointDistances";
import RegionTags from "../RegionTags";
import RegionLabel, { RegionLabelProps } from "../RegionLabel";
import ImageMask from "../ImageMask";
import RegionSelectAndTransformBoxes from "../RegionSelectAndTransformBoxes";
import VideoOrImageCanvasBackground from "../VideoOrImageCanvasBackground";
import useEventCallback from "use-event-callback";
import RegionShapes from "../RegionShapes";
import useWasdMode from "./use-wasd-mode";
import { ImagePosition } from "../types/common.ts";
import { AutosegOptions } from "autoseg/webworker";
import { tss } from "tss-react/mui";

const theme = createTheme();
const useStyles = tss.create({
  canvas: { width: "100%", height: "100%", position: "relative", zIndex: 1 },
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
  videoSrc: string | null;
  videoTime?: number;
  keypointDefinitions?: KeypointsDefinition;
  onMouseMove?: (point: { x: number; y: number }) => any;
  onMouseDown?: (point: { x: number; y: number }) => any;
  onMouseUp?: (point: { x: number; y: number }) => any;
  dragWithPrimary?: boolean;
  zoomWithPrimary?: boolean;
  createWithPrimary?: boolean;
  showTags?: boolean;
  realSize?: { w: number; h: number; unitName: string };
  showCrosshairs?: boolean;
  showMask?: boolean;
  showHighlightBox?: boolean;
  showPointDistances?: boolean;
  pointDistancePrecision?: number;
  regionClsList?: Array<string> | Array<{ id: string; label: string }>;
  regionTagList?: Array<string>;
  regionTagSingleSelection?: boolean;
  allowedArea?: { x: number; y: number; w: number; h: number };
  RegionEditLabel?:
    | ComponentType<RegionLabelProps>
    | FunctionComponent<RegionLabelProps>
    | null;
  videoPlaying?: boolean;
  zoomOnAllowedArea?: boolean;
  fullImageSegmentationMode?: boolean;
  autoSegmentationOptions?: AutosegOptions;
  modifyingAllowedArea?: boolean;
  allowComments?: boolean;
  onChangeRegion: (region: Region) => void;
  onBeginRegionEdit: (region: Region) => void;
  onCloseRegionEdit: (region: Region) => void;
  onDeleteRegion: (region: Region) => void;
  onBeginBoxTransform: (region: Box, point: [number, number]) => void;
  onBeginMovePolygonPoint: (region: Polygon, index: number) => void;
  onBeginMoveKeypoint: (region: Keypoints, keypointId: string) => void;
  onAddPolygonPoint: (
    polygon: Polygon,
    point: [number, number],
    index: number
  ) => void;
  onSelectRegion: (region: Region) => void;
  onBeginMovePoint: (point: Point) => void;
  onImageOrVideoLoaded: (props: {
    naturalWidth: number;
    naturalHeight: number;
    duration?: number;
  }) => void;
  onChangeVideoTime: (time: number) => void;
  onRegionClassAdded: (cls: string) => void;
  onChangeVideoPlaying?: (playing: boolean) => void;
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
  offset: { iw: number; ih: number } | null = null
) => {
  let mat = Matrix.from(1, 0, 0, 1, -10, -10);
  if (allowedArea && offset?.iw) {
    mat = mat
      .translate(allowedArea.x * offset.iw, allowedArea.y * offset.ih)
      .scaleU(allowedArea.w + 0.05);
  }
  return mat;
};

export const ImageCanvas = ({
  regions,
  imageSrc,
  videoSrc,
  videoTime,
  realSize,
  showTags,
  onMouseMove = () => null,
  onMouseDown = () => null,
  onMouseUp = () => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  pointDistancePrecision = 0,
  regionClsList,
  regionTagList,
  regionTagSingleSelection,
  showCrosshairs,
  showHighlightBox = true,
  showPointDistances,
  allowedArea,
  RegionEditLabel = null,
  videoPlaying = false,
  showMask = true,
  fullImageSegmentationMode,
  autoSegmentationOptions,
  onImageOrVideoLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMovePolygonPoint,
  onAddPolygonPoint,
  onBeginMoveKeypoint,
  onSelectRegion,
  onBeginMovePoint,
  onDeleteRegion,
  onChangeVideoTime,
  onChangeVideoPlaying,
  onRegionClassAdded,
  zoomOnAllowedArea = true,
  modifyingAllowedArea = false,
  keypointDefinitions,
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

  const getLatestMat: () => IMatrix = useEventCallback(() => mat);
  useWasdMode({ getLatestMat, changeMat });

  const { mouseEvents, mousePosition } = useMouse({
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
    zoomWithPrimary,
    dragWithPrimary,
    onMouseMove,
    onMouseDown,
    onMouseUp,
  });

  useLayoutEffect(() => changeMat(mat.clone()), [windowSize]);
  const projectRegionBox = useProjectRegionBox({ layoutParams, mat });

  const [imageDimensions, changeImageDimensions] = useState<{
    naturalWidth: number;
    naturalHeight: number;
  } | null>(null);
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth);

  const onVideoOrImageLoaded = useEventCallback(
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
      if (onImageOrVideoLoaded) onImageOrVideoLoaded(dims);
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
  const highlightedRegion = useMemo(() => {
    const highlightedRegions = regions.filter((r) => r.highlighted);
    if (highlightedRegions.length !== 1) return null;
    return highlightedRegions[0];
  }, [regions]);

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "calc(100vh - 68px)",
          position: "relative",
          overflow: "hidden",
          cursor: createWithPrimary
            ? "crosshair"
            : dragging
            ? "grabbing"
            : dragWithPrimary
            ? "grab"
            : zoomWithPrimary
            ? mat.a < 1
              ? "zoom-out"
              : "zoom-in"
            : undefined,
        }}
      >
        {showCrosshairs && (
          <Crosshairs key="crossHairs" mousePosition={mousePosition} />
        )}
        {imageLoaded && !dragging && (
          <RegionSelectAndTransformBoxes
            key="regionSelectAndTransformBoxes"
            regions={
              !modifyingAllowedArea || !allowedArea
                ? regions
                : [
                    {
                      type: "box",
                      id: "$$allowed_area",
                      cls: "allowed_area",
                      highlighted: true,
                      x: allowedArea.x,
                      y: allowedArea.y,
                      w: allowedArea.w,
                      h: allowedArea.h,
                      visible: true,
                      color: "#ff0",
                    },
                  ]
            }
            mouseEvents={mouseEvents}
            projectRegionBox={projectRegionBox}
            dragWithPrimary={dragWithPrimary}
            createWithPrimary={createWithPrimary}
            zoomWithPrimary={zoomWithPrimary}
            onBeginMovePoint={onBeginMovePoint}
            onSelectRegion={onSelectRegion}
            layoutParams={layoutParams}
            mat={mat}
            onBeginBoxTransform={onBeginBoxTransform}
            onBeginMovePolygonPoint={onBeginMovePolygonPoint}
            onBeginMoveKeypoint={onBeginMoveKeypoint}
            onAddPolygonPoint={onAddPolygonPoint}
            showHighlightBox={showHighlightBox}
          />
        )}
        {imageLoaded && showTags && !dragging && (
          <PreventScrollToParents key="regionTags">
            <RegionTags
              regions={regions}
              projectRegionBox={projectRegionBox}
              mouseEvents={mouseEvents}
              regionClsList={regionClsList}
              regionTagList={regionTagList}
              regionTagSingleSelection={regionTagSingleSelection}
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
        {!showTags && highlightedRegion && (
          <div key="topLeftTag" className={classes.fixedRegionLabel}>
            <RegionLabel
              allowedClasses={regionClsList}
              allowedTags={regionTagList}
              onChange={onChangeRegion}
              onDelete={onDeleteRegion}
              editing
              region={highlightedRegion}
              allowComments={allowComments}
            />
          </div>
        )}

        {zoomWithPrimary && zoomBox !== null && (
          <div
            key="zoomBox"
            style={{
              position: "absolute",
              zIndex: 1,
              border: "1px solid #fff",
              pointerEvents: "none",
              left: zoomBox.x,
              top: zoomBox.y,
              width: zoomBox.w,
              height: zoomBox.h,
            }}
          />
        )}
        {showPointDistances && (
          <PointDistances
            key="pointDistances"
            regions={regions}
            realSize={realSize}
            projectRegionBox={projectRegionBox}
            pointDistancePrecision={pointDistancePrecision}
          />
        )}
        <PreventScrollToParents
          style={{ width: "100%", height: "100%" }}
          {...mouseEvents}
        >
          {imagePosition && fullImageSegmentationMode ? (
            <ImageMask
              hide={!showMask}
              autoSegmentationOptions={autoSegmentationOptions}
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
            keypointDefinitions={keypointDefinitions}
            imagePosition={imagePosition}
            regions={regions}
          />
          <VideoOrImageCanvasBackground
            videoPlaying={videoPlaying}
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            onLoad={onVideoOrImageLoaded}
            videoTime={videoTime}
            videoSrc={videoSrc}
            imageSrc={imageSrc}
            useCrossOrigin={fullImageSegmentationMode}
            onChangeVideoTime={onChangeVideoTime}
            onChangeVideoPlaying={onChangeVideoPlaying}
          />
        </PreventScrollToParents>
        <div className={classes.zoomIndicator}>
          {((1 / mat.a) * 100).toFixed(0)}%
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ImageCanvas;
