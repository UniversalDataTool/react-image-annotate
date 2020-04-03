// @flow weak

import React, {
  Fragment,
  useRef,
  useState,
  useLayoutEffect,
  useEffect
} from "react"
import type { Node } from "react"
import { Matrix } from "transformation-matrix-js"
import getImageData from "get-image-data"
import Crosshairs from "../Crosshairs"
import type {
  Region,
  PixelRegion,
  Point,
  Polygon,
  Box
} from "./region-tools.js"
import { getEnclosingBox } from "./region-tools.js"
import { makeStyles } from "@material-ui/core/styles"
import styles from "./styles"
import classnames from "classnames"
import RegionLabel from "../RegionLabel"
import LockIcon from "@material-ui/icons/Lock"
import Paper from "@material-ui/core/Paper"
import HighlightBox from "../HighlightBox"
import PreventScrollToParents from "../PreventScrollToParents"
import useWindowSize from "../hooks/use-window-size.js"
import useMouse from "./use-mouse"
import useProjectRegionBox from "./use-project-box"
import useLoadImage from "../hooks/use-load-image"
import useExcludePattern from "../hooks/use-exclude-pattern"
import { useRafState } from "react-use"
import PointDistances from "../PointDistances"
import RegionTags from "../RegionTags"
import RegionSelectAndTransformBoxes from "../RegionSelectAndTransformBoxes"
import VideoOrImageCanvasBackground from "../VideoOrImageCanvasBackground"
import useEventCallback from "use-event-callback"

const useStyles = makeStyles(styles)

type Props = {
  regions: Array<Region>,
  imageSrc?: string,
  videoSrc?: string,
  videoTime?: number,
  onMouseMove?: ({ x: number, y: number }) => any,
  onMouseDown?: ({ x: number, y: number }) => any,
  onMouseUp?: ({ x: number, y: number }) => any,
  dragWithPrimary?: boolean,
  zoomWithPrimary?: boolean,
  createWithPrimary?: boolean,
  showTags?: boolean,
  realSize?: { width: number, height: number, unitName: string },
  showCrosshairs?: boolean,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  regionClsList?: Array<string>,
  regionTagList?: Array<string>,
  allowedArea?: { x: number, y: number, w: number, h: number },
  RegionEditLabel?: Node,
  videoPlaying?: boolean,

  onChangeRegion: Region => any,
  onBeginRegionEdit: Region => any,
  onCloseRegionEdit: Region => any,
  onDeleteRegion: Region => any,
  onBeginBoxTransform: (Box, [number, number]) => any,
  onBeginMovePolygonPoint: (Polygon, index: number) => any,
  onAddPolygonPoint: (Polygon, point: [number, number], index: number) => any,
  onSelectRegion: Region => any,
  onBeginMovePoint: Point => any,
  onImageOrVideoLoaded: ({
    naturalWidth: number,
    naturalHeight: number,
    duration?: number
  }) => any,
  onChangeVideoTime: number => any
}

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
  regions,
  imageSrc,
  videoSrc,
  videoTime,
  realSize,
  showTags,
  onMouseMove = p => null,
  onMouseDown = p => null,
  onMouseUp = p => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  pointDistancePrecision = 0,
  regionClsList,
  regionTagList,
  showCrosshairs,
  showPointDistances,
  allowedArea,
  RegionEditLabel = null,
  videoPlaying = false,

  onImageOrVideoLoaded,
  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMovePolygonPoint,
  onAddPolygonPoint,
  onSelectRegion,
  onBeginMovePoint,
  onDeleteRegion,
  onChangeVideoTime,
  onChangeVideoPlaying
}: Props) => {
  const classes = useStyles()

  const canvasEl = useRef(null)
  const layoutParams = useRef({})
  const [dragging, changeDragging] = useRafState(false)
  const [maskImagesLoaded, changeMaskImagesLoaded] = useRafState(0)
  const [zoomStart, changeZoomStart] = useRafState(null)
  const [zoomEnd, changeZoomEnd] = useRafState(null)
  const [mat, changeMat] = useRafState(getDefaultMat())
  const maskImages = useRef({})
  const windowSize = useWindowSize()

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
    onMouseUp
  })

  useLayoutEffect(() => changeMat(mat.clone()), [windowSize])

  const innerMousePos = mat.applyToPoint(
    mousePosition.current.x,
    mousePosition.current.y
  )

  const projectRegionBox = useProjectRegionBox({ layoutParams, mat })

  const [imageDimensions, changeImageDimensions] = useState()
  const imageLoaded = Boolean(imageDimensions && imageDimensions.naturalWidth)
  const onVideoOrImageLoaded = useEventCallback(
    ({ naturalWidth, naturalHeight, duration }) => {
      const dims = { naturalWidth, naturalHeight, duration }
      if (onImageOrVideoLoaded) onImageOrVideoLoaded(dims)
      changeImageDimensions(dims)
      // Redundant update to fix rerendering issues
      setTimeout(() => changeImageDimensions(dims), 10)
    }
  )

  const excludePattern = useExcludePattern()

  const canvas = canvasEl.current
  if (canvas && imageLoaded) {
    const { clientWidth, clientHeight } = canvas

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

  useLayoutEffect(() => {
    if (!imageDimensions) return
    const { clientWidth, clientHeight } = canvas
    canvas.width = clientWidth
    canvas.height = clientHeight
    const context = canvas.getContext("2d")

    context.save()
    context.transform(
      ...mat
        .clone()
        .inverse()
        .toArray()
    )

    const { iw, ih } = layoutParams.current

    if (allowedArea) {
      // Pattern to indicate the NOT allowed areas
      const { x, y, w, h } = allowedArea
      context.save()
      context.globalAlpha = 0.25
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
      outer.forEach(p => context.lineTo(...p))
      context.lineTo(...outer[0])
      context.closePath()

      inner.reverse()
      context.moveTo(...inner[0])
      inner.forEach(p => context.lineTo(...p))
      context.lineTo(...inner[0])

      context.fillStyle = excludePattern || "#f00"
      context.fill()

      context.restore()
    }

    context.save()
    context.globalAlpha = mat.a * 0.5 + 0.5
    context.lineWidth = mat.a * 1 + 1
    if (context.globalAlpha > 0.6) {
      context.shadowColor = "black"
      context.shadowBlur = 4
    }
    for (const region of regions.filter(
      r => r.visible || r.visible === undefined
    )) {
      switch (region.type) {
        case "point": {
          context.save()

          context.beginPath()
          context.strokeStyle = region.color
          context.moveTo(region.x * iw - 10, region.y * ih)
          context.lineTo(region.x * iw - 2, region.y * ih)
          context.moveTo(region.x * iw + 10, region.y * ih)
          context.lineTo(region.x * iw + 2, region.y * ih)
          context.moveTo(region.x * iw, region.y * ih - 10)
          context.lineTo(region.x * iw, region.y * ih - 2)
          context.moveTo(region.x * iw, region.y * ih + 10)
          context.lineTo(region.x * iw, region.y * ih + 2)
          context.moveTo(region.x * iw + 5, region.y * ih)
          context.arc(region.x * iw, region.y * ih, 5, 0, 2 * Math.PI)
          context.stroke()
          context.restore()
          break
        }
        case "box": {
          context.save()

          context.shadowColor = "black"
          context.shadowBlur = 4
          context.strokeStyle = region.color
          context.strokeRect(
            region.x * iw,
            region.y * ih,
            region.w * iw,
            region.h * ih
          )

          context.restore()
          break
        }
        case "polygon": {
          context.save()

          context.shadowColor = "black"
          context.shadowBlur = 4
          context.strokeStyle = region.color

          context.beginPath()
          context.moveTo(region.points[0][0] * iw, region.points[0][1] * ih)
          for (const point of region.points) {
            context.lineTo(point[0] * iw, point[1] * ih)
          }
          if (!region.open) context.closePath()
          context.stroke()
          context.restore()
          break
        }
        case "pixel": {
          context.save()

          if (maskImages.current[region.src]) {
            if (maskImages.current[region.src].nodeName === "CANVAS") {
              context.globalAlpha = 0.6
              context.drawImage(
                maskImages.current[region.src],
                region.sx * iw,
                region.sy * ih,
                region.w * iw,
                region.h * ih
              )
            }
          } else {
            maskImages.current[region.src] = new Image()
            maskImages.current[region.src].onload = () => {
              const img = maskImages.current[region.src]
              const newCanvas = document.createElement("canvas")
              newCanvas.width = img.naturalWidth
              newCanvas.height = img.naturalHeight
              const ctx = newCanvas.getContext("2d")
              ctx.drawImage(img, 0, 0)
              const imgData = ctx.getImageData(
                0,
                0,
                img.naturalWidth,
                img.naturalHeight
              )
              for (let i = 0; i < imgData.data.length; i += 4) {
                const [r, g, b, a] = imgData.data.slice(i, i + 4)
                const black = r < 10 && g < 10 && b < 10
                imgData.data[i] = 0
                imgData.data[i + 1] = 0
                imgData.data[i + 2] = black ? 255 : 0
                imgData.data[i + 3] = black ? 255 : 0
              }
              ctx.clearRect(0, 0, img.naturalWidth, img.naturalHeight)
              ctx.putImageData(imgData, 0, 0)
              maskImages.current[region.src] = newCanvas
              changeMaskImagesLoaded(maskImagesLoaded + 1)
            }
            maskImages.current[region.src].src = region.src
          }

          context.restore()
          break
        }
      }
    }
    context.restore()
    context.restore()
  })

  const { iw, ih } = layoutParams.current

  let zoomBox =
    !zoomStart || !zoomEnd
      ? null
      : {
          ...mat
            .clone()
            .inverse()
            .applyToPoint(zoomStart.x, zoomStart.y),
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
    topLeft: mat
      .clone()
      .inverse()
      .applyToPoint(0, 0),
    bottomRight: mat
      .clone()
      .inverse()
      .applyToPoint(iw, ih)
  }

  return (
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
      {imageLoaded && (
        <RegionSelectAndTransformBoxes
          key="regionSelectAndTransformBoxes"
          regions={regions}
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
          onAddPolygonPoint={onAddPolygonPoint}
        />
      )}
      {imageLoaded && showTags && (
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
          />
        </PreventScrollToParents>
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
        style={{ width: "100%", height: "100%" }}
        {...mouseEvents}
      >
        <>
          <canvas className={classes.canvas} ref={canvasEl} />
          <VideoOrImageCanvasBackground
            videoPlaying={videoPlaying}
            imagePosition={imagePosition}
            mouseEvents={mouseEvents}
            onLoad={onVideoOrImageLoaded}
            videoTime={videoTime}
            videoSrc={videoSrc}
            imageSrc={imageSrc}
            onChangeVideoTime={onChangeVideoTime}
            onChangeVideoPlaying={onChangeVideoPlaying}
          />
        </>
      </PreventScrollToParents>
      <div className={classes.zoomIndicator}>
        {((1 / mat.a) * 100).toFixed(0)}%
      </div>
    </div>
  )
}
