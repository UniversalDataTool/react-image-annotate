import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {Matrix} from "transformation-matrix-js"
import Crosshairs from "../Crosshairs"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import styles from "./styles"
import PreventScrollToParents from "../PreventScrollToParents"
import useWindowSize from "../hooks/use-window-size.js"
import useMouse from "./use-mouse"
import useProjectRegionBox from "./use-project-box"
import useExcludePattern from "../hooks/use-exclude-pattern"
import {useRafState} from "react-use"
import PointDistances from "../PointDistances"
import RegionTags from "../RegionTags"
import RegionLabel from "../RegionLabel"
import RegionSelectAndTransformBoxes from "../RegionSelectAndTransformBoxes"
import VideoOrImageCanvasBackground from "../VideoOrImageCanvasBackground"
import useEventCallback from "use-event-callback"
import RegionShapes from "../RegionShapes"
import useWasdMode from "./use-wasd-mode"
import PropTypes from 'prop-types'

const theme = createTheme()

const getDefaultMat = (allowedArea = null, {iw, ih} = {}) => {
  let mat = Matrix.from(1, 0, 0, 1, -10, -10)
  if (allowedArea && iw) {
    mat = mat
      .translate(allowedArea.x * iw, allowedArea.y * ih)
      .scaleU(allowedArea.w + 0.05)
  }
  return mat
}

export const ImageCanvas = ({
  regions,
  imageSrc,
  videoSrc,
  videoTime,
  realSize,
  showTags,
  onMouseMove = (p) => null,
  onMouseDown = (p) => null,
  onMouseUp = (p) => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  pointDistancePrecision = 0,
  regionClsList,
  regionTagList,
  showCrosshairs,
  showHighlightBox = true,
  showPointDistances,
  allowedArea,
  RegionEditLabel = null,
  videoPlaying = false,
  onImageOrVideoLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMoveLinePoint,
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
  enabledRegionProps
}) => {
  const canvasEl = useRef(null)
  const layoutParams = useRef({})
  const [dragging, changeDragging] = useRafState(false)
  const [zoomStart, changeZoomStart] = useRafState(null)
  const [zoomEnd, changeZoomEnd] = useRafState(null)
  const [mat, changeMat] = useRafState(getDefaultMat())
  const windowSize = useWindowSize()

  const getLatestMat = useEventCallback(() => mat)
  useWasdMode({getLatestMat, changeMat})

  const {mouseEvents, mousePosition} = useMouse({
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
    onMouseUp
  })

  useLayoutEffect(() => changeMat(mat.clone()), [windowSize])

  const projectRegionBox = useProjectRegionBox({layoutParams, mat})

  const [imageDimensions, changeImageDimensions] = useState()
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth)

  const onVideoOrImageLoaded = useEventCallback(
    ({naturalWidth, naturalHeight, duration}) => {
      const dims = {naturalWidth, naturalHeight, duration}
      if (onImageOrVideoLoaded) onImageOrVideoLoaded(dims)
      changeImageDimensions(dims)
      // Redundant update to fix rerendering issues
      setTimeout(() => changeImageDimensions(dims), 10)
    }
  )

  const excludePattern = useExcludePattern()

  const canvas = canvasEl.current
  if (canvas && imageLoaded) {
    const {clientWidth, clientHeight} = canvas

    const fitScale = Math.max(
      imageDimensions.naturalWidth / (clientWidth - 20),
      imageDimensions.naturalHeight / (clientHeight - 20)
    )

    const [iw, ih] = [
      imageDimensions.naturalWidth / fitScale,
      imageDimensions.naturalHeight / fitScale
    ]

    layoutParams.current = {
      iw,
      ih,
      fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight
    }
  }

  useEffect(() => {
    if (!imageLoaded) return
    changeMat(
      getDefaultMat(
        zoomOnAllowedArea ? allowedArea : null,
        layoutParams.current
      )
    )
    // eslint-disable-next-line
  }, [imageLoaded])

  useLayoutEffect(() => {
    if (!imageDimensions) return
    const {clientWidth, clientHeight} = canvas
    canvas.width = clientWidth
    // TODO: This might a problem - Content window becoming bigger comes from this
    canvas.height = clientHeight
    const context = canvas.getContext("2d")
    context.save()
    context.transform(...mat.clone().inverse().toArray())

    const {iw, ih} = layoutParams.current

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      const {x, y, w, h} = allowedArea
      context.save()
      context.globalAlpha = 1
      const outer = [
        [0, 0],
        [iw, 0],
        [iw, ih],
        [0, ih]
      ]
      const inner = [
        [x * iw, y * ih],
        [x * iw + w * iw, y * ih],
        [x * iw + w * iw, y * ih + h * ih],
        [x * iw, y * ih + h * ih]
      ]
      context.moveTo(...outer[0])
      outer.forEach((p) => context.lineTo(...p))
      context.lineTo(...outer[0])
      context.closePath()

      inner.reverse()
      context.moveTo(...inner[0])
      inner.forEach((p) => context.lineTo(...p))
      context.lineTo(...inner[0])

      context.fillStyle = excludePattern || "#f00"
      context.fill()

      context.restore()
    }

    context.restore()
  })

  const {iw, ih} = layoutParams.current

  let zoomBox =
    !zoomStart || !zoomEnd
      ? null
      : {
        ...mat.clone().inverse().applyToPoint(zoomStart.x, zoomStart.y),
        w: (zoomEnd.x - zoomStart.x) / mat.a,
        h: (zoomEnd.y - zoomStart.y) / mat.d
      }
  if (zoomBox) {
    if (zoomBox.w < 0) {
      zoomBox.x += zoomBox.w
      zoomBox.w *= -1
    }
    if (zoomBox.h < 0) {
      zoomBox.y += zoomBox.h
      zoomBox.h *= -1
    }
  }

  const imagePosition = {
    topLeft: mat.clone().inverse().applyToPoint(0, 0),
    bottomRight: mat.clone().inverse().applyToPoint(iw, ih)
  }

  const highlightedRegion = useMemo(() => {
    const highlightedRegions = regions.filter((r) => r.highlighted)
    if (highlightedRegions.length !== 1) return null
    return highlightedRegions[0]
  }, [regions])

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
                  : undefined
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
                    color: "#ff0"
                  }
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
            onBeginMoveLinePoint={onBeginMoveLinePoint}
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
              onBeginRegionEdit={onBeginRegionEdit}
              onChangeRegion={onChangeRegion}
              onCloseRegionEdit={onCloseRegionEdit}
              onDeleteRegion={onDeleteRegion}
              layoutParams={layoutParams}
              imageSrc={imageSrc}
              RegionEditLabel={RegionEditLabel}
              onRegionClassAdded={onRegionClassAdded}
              enabledRegionProps={enabledRegionProps}
            />
          </PreventScrollToParents>
        )}
        {!showTags && highlightedRegion && (
          <div key="topLeftTag" style={styles.fixedRegionLabel}>
            <RegionLabel
              disableClose
              allowedClasses={regionClsList}
              allowedTags={regionTagList}
              onChange={onChangeRegion}
              onDelete={onDeleteRegion}
              editing
              region={highlightedRegion}
              imageSrc={imageSrc}
              enabledProperties={enabledRegionProps}
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
              height: zoomBox.h
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
          style={{width: "100%", height: "100%"}}
          {...mouseEvents}
        >
          <>
            <canvas
              style={{opacity: 0.25, ...styles.canvas}}
              ref={canvasEl}
            />
            <RegionShapes
              mat={mat}
              keypointDefinitions={keypointDefinitions}
              imagePosition={imagePosition}
              regions={regions}
              fullSegmentationMode={false}
            />
            <VideoOrImageCanvasBackground
              videoPlaying={videoPlaying}
              imagePosition={imagePosition}
              mouseEvents={mouseEvents}
              onLoad={onVideoOrImageLoaded}
              videoTime={videoTime}
              videoSrc={videoSrc}
              imageSrc={imageSrc}
              useCrossOrigin={false}
              onChangeVideoTime={onChangeVideoTime}
              onChangeVideoPlaying={onChangeVideoPlaying}
            />
          </>
        </PreventScrollToParents>
        <div style={styles.zoomIndicator}>
          {((1 / mat.a) * 100).toFixed(0)}%
        </div>
      </div>
    </ThemeProvider>
  )
}

ImageCanvas.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.object).isRequired,
  imageSrc: PropTypes.string,
  videoSrc: PropTypes.string,
  videoTime: PropTypes.number,
  keypointDefinitions: PropTypes.elementType,
  onMouseMove: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  dragWithPrimary: PropTypes.bool,
  zoomWithPrimary: PropTypes.bool,
  createWithPrimary: PropTypes.bool,
  showTags: PropTypes.bool,
  realSize: PropTypes.shape({width: PropTypes.number, height: PropTypes.number, unitName: PropTypes.string}),
  showCrosshairs: PropTypes.bool,
  showMask: PropTypes.bool,
  showHighlightBox: PropTypes.bool,
  showPointDistances: PropTypes.bool,
  pointDistancePrecision: PropTypes.number,
  regionClsList: PropTypes.arrayOf(PropTypes.string),
  regionTagList: PropTypes.arrayOf(PropTypes.string),
  allowedArea: PropTypes.shape({x: PropTypes.number, y: PropTypes.number, w: PropTypes.number, h: PropTypes.number}),
  RegionEditLabel: PropTypes.element,
  videoPlaying: PropTypes.bool,
  zoomOnAllowedArea: PropTypes.bool,
  modifyingAllowedArea: PropTypes.bool,
  enabledRegionProps: PropTypes.arrayOf(PropTypes.string),
  onChangeRegion: PropTypes.func.isRequired,
  onBeginRegionEdit: PropTypes.func.isRequired,
  onCloseRegionEdit: PropTypes.func.isRequired,
  onDeleteRegion: PropTypes.func.isRequired,
  onBeginBoxTransform: PropTypes.func.isRequired,
  onBeginMovePolygonPoint: PropTypes.func.isRequired,
  onBeginMoveKeypoint: PropTypes.func.isRequired,
  onAddPolygonPoint: PropTypes.func.isRequired,
  onSelectRegion: PropTypes.func.isRequired,
  onBeginMovePoint: PropTypes.func.isRequired,
  onImageOrVideoLoaded: PropTypes.func.isRequired,
  onChangeVideoTime: PropTypes.func.isRequired,
  onRegionClassAdded: PropTypes.func.isRequired,
  onChangeVideoPlaying: PropTypes.func,
}

export default ImageCanvas
