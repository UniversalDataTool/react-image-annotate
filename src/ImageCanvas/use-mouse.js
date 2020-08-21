// @flow weak

import { useRef } from "react"
import { Matrix } from "transformation-matrix-js"

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10)

export default ({
  canvasEl,
  changeMat,
  changeDragging,
  zoomStart,
  zoomEnd,
  changeZoomStart,
  changeZoomEnd,
  layoutParams,
  zoomWithPrimary,
  dragWithPrimary,
  mat,
  onMouseMove,
  onMouseUp,
  onMouseDown,
  dragging,
}) => {
  const mousePosition = useRef({ x: 0, y: 0 })
  const prevMousePosition = useRef({ x: 0, y: 0 })

  const zoomIn = (direction, point) => {
    const [mx, my] = [point.x, point.y]
    let scale =
      typeof direction === "object" ? direction.to / mat.a : 1 + 0.2 * direction

    // NOTE: We're mutating mat here
    mat.translate(mx, my).scaleU(scale)
    if (mat.a > 2) mat.scaleU(2 / mat.a)
    if (mat.a < 0.05) mat.scaleU(0.05 / mat.a)
    mat.translate(-mx, -my)

    changeMat(mat.clone())
  }

  const mouseEvents = {
    onMouseMove: (e) => {
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

        changeMat(mat.clone())
      }
      e.preventDefault()
    },
    onMouseDown: (e, specialEvent = {}) => {
      e.preventDefault()

      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
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
    onMouseUp: (e) => {
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
          if (scale < 0.05) scale = 0.05
          if (scale > 10) scale = 10

          const newMat = getDefaultMat()
            .translate(zoomStart.x, zoomStart.y)
            .scaleU(scale)

          changeMat(newMat.clone())
        }

        changeZoomStart(null)
        changeZoomEnd(null)
      }
      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
        return changeDragging(false)
      if (e.button === 0) {
        const { iw, ih } = layoutParams.current
        onMouseUp({ x: projMouse.x / iw, y: projMouse.y / ih })
      }
    },
    onWheel: (e) => {
      const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      zoomIn(direction, mousePosition.current)
      // e.preventDefault()
    },
    onContextMenu: (e) => {
      e.preventDefault()
    },
  }
  return { mouseEvents, mousePosition }
}
