// @flow
import React, { Fragment, useRef, useState, useLayoutEffect } from "react"
import { Matrix } from "transformation-matrix-js"
import getImageData from "get-image-data"
import type {
  Region,
  PixelRegion,
  Point,
  Polygon,
  Box
} from "./region-tools.js"
import { getEnclosingBox } from "./region-tools.js"
import { makeStyles } from "@material-ui/styles"
import styles from "./styles"
import classnames from "classnames"
import RegionLabel from "../RegionLabel"
import LockIcon from "@material-ui/icons/Lock"
import Paper from "@material-ui/core/Paper"

const useStyles = makeStyles(styles)

const boxCursorMap = [
  ["nw-resize", "n-resize", "ne-resize"],
  ["w-resize", "grab", "e-resize"],
  ["sw-resize", "s-resize", "se-resize"]
]

type Props = {
  regions: Array<Region>,
  imageSrc: string,
  onMouseMove?: ({ x: number, y: number }) => any,
  onMouseDown?: ({ x: number, y: number }) => any,
  onMouseUp?: ({ x: number, y: number }) => any,
  dragWithPrimary?: boolean,
  zoomWithPrimary?: boolean,
  createWithPrimary?: boolean,
  showTags?: boolean,
  regionClsList?: Array<string>,
  regionTagList?: Array<string>,

  onChangeRegion: Region => any,
  onBeginRegionEdit: Region => any,
  onCloseRegionEdit: Region => any,
  onDeleteRegion: Region => any,
  onBeginBoxTransform: (Box, [number, number]) => any,
  onBeginMovePolygonPoint: (Polygon, index: number) => any,
  onAddPolygonPoint: (Polygon, point: [number, number], index: number) => any,
  onSelectRegion: Region => any,
  onBeginMovePoint: Point => any
}

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
  regions,
  imageSrc,
  showTags,
  onMouseMove = p => null,
  onMouseDown = p => null,
  onMouseUp = p => null,
  dragWithPrimary = false,
  zoomWithPrimary = false,
  createWithPrimary = false,
  regionClsList,
  regionTagList,

  onChangeRegion,
  onBeginRegionEdit,
  onCloseRegionEdit,
  onBeginBoxTransform,
  onBeginMovePolygonPoint,
  onAddPolygonPoint,
  onSelectRegion,
  onBeginMovePoint,
  onDeleteRegion
}: Props) => {
  const classes = useStyles()

  const canvasEl = useRef(null)
  const image = useRef(null)
  const layoutParams = useRef({})
  const [imageLoaded, changeImageLoaded] = useState(false)
  const [dragging, changeDragging] = useState(false)
  const [maskImagesLoaded, changeMaskImagesLoaded] = useState(0)
  const [zoomStart, changeZoomStart] = useState(null)
  const [zoomEnd, changeZoomEnd] = useState(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const prevMousePosition = useRef({ x: 0, y: 0 })
  const [mat, changeMat] = useState(getDefaultMat())
  const maskImages = useRef({})

  const innerMousePos = mat.applyToPoint(
    mousePosition.current.x,
    mousePosition.current.y
  )

  const projectRegionBox = r => {
    const { iw, ih } = layoutParams.current
    const bbox = getEnclosingBox(r)
    const margin = r.type === "point" ? 15 : 2
    const cbox = {
      x: bbox.x * iw - margin,
      y: bbox.y * ih - margin,
      w: bbox.w * iw + margin * 2,
      h: bbox.h * ih + margin * 2
    }
    const pbox = {
      ...mat
        .clone()
        .inverse()
        .applyToPoint(cbox.x, cbox.y),
      w: cbox.w / mat.a,
      h: cbox.h / mat.d
    }
    return pbox
  }

  useLayoutEffect(() => {
    if (image.current === null) {
      image.current = new Image()
      image.current.onload = () => {
        changeImageLoaded(true)
      }
      image.current.src = imageSrc
    }
    const canvas = canvasEl.current
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

    const fitScale = Math.max(
      image.current.naturalWidth / (clientWidth - 20),
      image.current.naturalHeight / (clientHeight - 20)
    )

    const [iw, ih] = [
      image.current.naturalWidth / fitScale,
      image.current.naturalHeight / fitScale
    ]

    layoutParams.current = {
      iw,
      ih,
      fitScale,
      canvasWidth: clientWidth,
      canvasHeight: clientHeight
    }

    context.drawImage(image.current, 0, 0, iw, ih)

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

  const zoomIn = (direction, point) => {
    const [mx, my] = [point.x, point.y]
    let scale =
      typeof direction === "object" ? direction.to / mat.a : 1 + 0.2 * direction

    // NOTE: We're mutating mat here
    mat.translate(mx, my).scaleU(scale)
    if (mat.a > 2) mat.scaleU(2 / mat.a)
    if (mat.a < 0.1) mat.scaleU(0.1 / mat.a)
    mat.translate(-mx, -my)

    changeMat(mat)
  }

  const mouseEvents = {
    onMouseMove: e => {
      const { left, top } = canvasEl.current.getBoundingClientRect()
      prevMousePosition.current.x = mousePosition.current.x
      prevMousePosition.current.y = mousePosition.current.y
      mousePosition.current.x = e.clientX - left
      mousePosition.current.y = e.clientY - top

      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      )

      if (zoomWithPrimary && zoomStart) {
        changeZoomEnd(projMouse)
      }

      const { iw, ih } = layoutParams.current
      onMouseMove({ x: projMouse.x / iw, y: projMouse.y / ih })

      if (dragging) {
        mat.translate(
          prevMousePosition.current.x - mousePosition.current.x,
          prevMousePosition.current.y - mousePosition.current.y
        )

        changeMat(mat)
      }
      e.preventDefault()
    },
    onMouseDown: (e, specialEvent = {}) => {
      e.preventDefault()

      if (e.button === 1 || (e.button === 0 && dragWithPrimary))
        return changeDragging(true)
      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      )
      if (zoomWithPrimary && e.button === 0) {
        changeZoomStart(projMouse)
        changeZoomEnd(projMouse)
        return
      }
      if (e.button === 0) {
        if (specialEvent.type === "resize-box") {
          // onResizeBox()
        }
        if (specialEvent.type === "move-region") {
          // onResizeBox()
        }
        const { iw, ih } = layoutParams.current
        onMouseDown({ x: projMouse.x / iw, y: projMouse.y / ih })
      }
    },
    onMouseUp: e => {
      e.preventDefault()
      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      )
      if (zoomStart) {
        const zoomEnd = projMouse
        if (
          Math.abs(zoomStart.x - zoomEnd.x) < 10 &&
          Math.abs(zoomStart.y - zoomEnd.y) < 10
        ) {
          if (mat.a < 1) {
            zoomIn({ to: 1 }, mousePosition.current)
          } else {
            zoomIn({ to: 0.25 }, mousePosition.current)
          }
        } else {
          const { iw, ih } = layoutParams.current

          if (zoomStart.x > zoomEnd.x) {
            ;[zoomStart.x, zoomEnd.x] = [zoomEnd.x, zoomStart.x]
          }
          if (zoomStart.y > zoomEnd.y) {
            ;[zoomStart.y, zoomEnd.y] = [zoomEnd.y, zoomStart.y]
          }

          // The region defined by zoomStart and zoomEnd should be the new transform
          let scale = Math.min(
            (zoomEnd.x - zoomStart.x) / iw,
            (zoomEnd.y - zoomStart.y) / ih
          )
          if (scale < 0.1) scale = 0.1
          if (scale > 10) scale = 10

          const newMat = getDefaultMat()
            .translate(zoomStart.x, zoomStart.y)
            .scaleU(scale)

          changeMat(newMat)
        }

        changeZoomStart(null)
        changeZoomEnd(null)
      }
      if (e.button === 1 || (e.button === 0 && dragWithPrimary))
        return changeDragging(false)
      if (e.button === 0) {
        const { iw, ih } = layoutParams.current
        onMouseUp({ x: projMouse.x / iw, y: projMouse.y / ih })
      }
    },
    onWheel: e => {
      const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      zoomIn(direction, mousePosition.current)
      e.preventDefault()
    }
  }

  const { iw, ih } = layoutParams.current

  let zoomBox = !zoomStart
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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
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
      {regions
        .filter(r => r.visible || r.visible === undefined)
        .filter(r => !r.locked)
        .map((r, i) => {
          const pbox = projectRegionBox(r)
          const { iw, ih } = layoutParams.current
          return (
            <Fragment>
              <svg
                key={r.id}
                className={classnames(classes.highlightBox, {
                  highlighted: r.highlighted
                })}
                {...mouseEvents}
                {...(!zoomWithPrimary && !dragWithPrimary
                  ? {
                      onMouseDown: e => {
                        if (
                          !r.locked &&
                          r.type === "point" &&
                          r.highlighted &&
                          e.button === 0
                        ) {
                          return onBeginMovePoint(r)
                        }
                        if (e.button === 0 && !createWithPrimary)
                          return onSelectRegion(r)
                        mouseEvents.onMouseDown(e)
                      }
                    }
                  : {})}
                style={{
                  ...(r.highlighted
                    ? {
                        pointerEvents: r.type !== "point" ? "none" : undefined,
                        cursor: "grab"
                      }
                    : {
                        cursor: !(
                          zoomWithPrimary ||
                          dragWithPrimary ||
                          createWithPrimary
                        )
                          ? "pointer"
                          : undefined,
                        pointerEvents:
                          zoomWithPrimary ||
                          dragWithPrimary ||
                          (createWithPrimary && !r.highlighted)
                            ? "none"
                            : undefined
                      }),
                  position: "absolute",
                  left: pbox.x - 5,
                  top: pbox.y - 5,
                  width: pbox.w + 10,
                  height: pbox.h + 10
                }}
              >
                <path
                  d={`M5,5 L${pbox.w + 5},5 L${pbox.w + 5},${pbox.h +
                    5} L5,${pbox.h + 5} Z`}
                />
              </svg>
              {r.type === "box" &&
                !dragWithPrimary &&
                !zoomWithPrimary &&
                !r.locked &&
                r.highlighted &&
                mat.a < 1.2 &&
                [
                  [0, 0],
                  [0.5, 0],
                  [1, 0],
                  [1, 0.5],
                  [1, 1],
                  [0.5, 1],
                  [0, 1],
                  [0, 0.5],
                  [0.5, 0.5]
                ].map(([px, py], i) => (
                  <div
                    key={i}
                    className={classes.transformGrabber}
                    {...mouseEvents}
                    onMouseDown={e => {
                      if (e.button === 0)
                        return onBeginBoxTransform(r, [px * 2 - 1, py * 2 - 1])
                      mouseEvents.onMouseDown(e)
                    }}
                    style={{
                      left: pbox.x - 4 - 2 + pbox.w * px,
                      top: pbox.y - 4 - 2 + pbox.h * py,
                      cursor: boxCursorMap[py * 2][px * 2],
                      borderRadius: px === 0.5 && py === 0.5 ? 4 : undefined
                    }}
                  />
                ))}
              {r.type === "polygon" &&
                !dragWithPrimary &&
                !zoomWithPrimary &&
                !r.locked &&
                r.highlighted &&
                r.points.map(([px, py], i) => {
                  const proj = mat
                    .clone()
                    .inverse()
                    .applyToPoint(px * iw, py * ih)
                  return (
                    <div
                      key={i}
                      {...mouseEvents}
                      onMouseDown={e => {
                        if (e.button === 0 && (!r.open || i === 0))
                          return onBeginMovePolygonPoint(r, i)
                        mouseEvents.onMouseDown(e)
                      }}
                      className={classes.transformGrabber}
                      style={{
                        cursor: !r.open
                          ? "move"
                          : i === 0
                          ? "pointer"
                          : undefined,
                        pointerEvents:
                          r.open && i === r.points.length - 1
                            ? "none"
                            : undefined,
                        left: proj.x - 4,
                        top: proj.y - 4
                      }}
                    />
                  )
                })}
              {r.type === "polygon" &&
                r.highlighted &&
                !dragWithPrimary &&
                !zoomWithPrimary &&
                !r.locked &&
                !r.open &&
                r.points.length > 1 &&
                r.points
                  .map((p1, i) => [p1, r.points[(i + 1) % r.points.length]])
                  .map(([p1, p2]) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
                  .map((pa, i) => {
                    const proj = mat
                      .clone()
                      .inverse()
                      .applyToPoint(pa[0] * iw, pa[1] * ih)
                    return (
                      <div
                        key={i}
                        {...mouseEvents}
                        onMouseDown={e => {
                          if (e.button === 0)
                            return onAddPolygonPoint(r, pa, i + 1)
                          mouseEvents.onMouseDown(e)
                        }}
                        className={classes.transformGrabber}
                        style={{
                          cursor: "copy",
                          left: proj.x - 4,
                          top: proj.y - 4,
                          border: "2px dotted #fff",
                          opacity: 0.5
                        }}
                      />
                    )
                  })}
            </Fragment>
          )
        })}
      {showTags &&
        regions
          .filter(r => r.visible || r.visible === undefined)
          .map(region => {
            const pbox = projectRegionBox(region)
            const { iw, ih } = layoutParams.current
            let margin = 8
            if (region.highlighted && region.type === "box") margin += 6
            const labelBoxHeight =
              region.editingLabels && !region.locked ? 170 : 40
            const coords =
              pbox.y > labelBoxHeight
                ? {
                    left: pbox.x,
                    bottom: layoutParams.current.canvasHeight - pbox.y + margin
                  }
                : { left: pbox.x, top: pbox.y + pbox.h + margin / 2 }
            if (region.locked) {
              return (
                <Paper
                  style={{
                    position: "absolute",
                    ...coords,
                    zIndex: 10,
                    backgroundColor: "#fff",
                    borderRadius: 4,
                    padding: 2,
                    paddingBottom: 0,
                    opacity: 0.5,
                    pointerEvents: "none"
                  }}
                >
                  <LockIcon style={{ width: 16, height: 16, color: "#333" }} />
                </Paper>
              )
            }
            return (
              <div
                style={{
                  position: "absolute",
                  ...coords,
                  zIndex: 10 + (region.editingLabels ? 5 : 0)
                }}
                {...(!region.editingLabels ? mouseEvents : {})}
                onMouseDown={e => e.preventDefault()}
                onMouseUp={e => e.preventDefault()}
                onMouseEnter={e => {
                  if (region.editingLabels) {
                    mouseEvents.onMouseUp(e)
                    e.button = 1
                    mouseEvents.onMouseUp(e)
                  }
                }}
              >
                <RegionLabel
                  allowedClasses={regionClsList}
                  allowedTags={regionTagList}
                  onOpen={onBeginRegionEdit}
                  onChange={onChangeRegion}
                  onClose={onCloseRegionEdit}
                  onDelete={onDeleteRegion}
                  editing={region.editingLabels}
                  region={region}
                />
              </div>
            )
          })}
      {zoomWithPrimary && zoomBox !== null && (
        <div
          style={{
            position: "absolute",
            border: "1px solid #fff",
            pointerEvents: "none",
            left: zoomBox.x,
            top: zoomBox.y,
            width: zoomBox.w,
            height: zoomBox.h
          }}
        />
      )}
      <canvas {...mouseEvents} className={classes.canvas} ref={canvasEl} />
      <div className={classes.zoomIndicator}>
        {((1 / mat.a) * 100).toFixed(0)}%
      </div>
    </div>
  )
}
