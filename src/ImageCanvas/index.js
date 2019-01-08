// @flow

import React, { useRef, useState, useLayoutEffect } from "react"
import exampleImage from "./seves_desk.story.jpg"

export default () => {
  const canvasEl = useRef(null)
  const image = useRef(null)
  const [imageLoaded, changeImageLoaded] = useState(false)
  const [shiftKeyIsDown, changeShiftKeyIsDown] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const [[tx, ty, sx, sy], changeTransform] = useState([0, 0, 1, 1])

  useLayoutEffect(() => {
    if (image.current === null) {
      image.current = new Image()
      image.current.onload = () => {
        changeImageLoaded(true)
      }
      image.current.src = exampleImage
    }
    const canvas = canvasEl.current
    const { clientWidth, clientHeight } = canvas
    canvas.width = clientWidth
    canvas.height = clientHeight
    const context = canvas.getContext("2d")
    context.save()
    context.translate(tx, ty)
    context.scale(sx, sy)

    const fitScale = Math.max(
      image.current.naturalWidth / (clientWidth * 0.85),
      image.current.naturalHeight / (clientHeight * 0.85)
    )

    const [iw, ih] = [
      image.current.naturalWidth / fitScale,
      image.current.naturalHeight / fitScale
    ]

    context.drawImage(
      image.current,
      clientWidth / 2 - iw / 2,
      clientHeight / 2 - ih / 2,
      iw,
      ih
    )
    context.restore()

    const onKeyDown = e => e.key === "Shift" && changeShiftKeyIsDown(true)
    const onKeyUp = e => e.key === "Shift" && changeShiftKeyIsDown(false)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  })

  return (
    <canvas
      onMouseMove={e => {
        const { left, top } = e.target.getBoundingClientRect()
        mousePosition.current.x = e.clientX - left
        mousePosition.current.y = e.clientY - top

        const [umx, umy] = [
          (mousePosition.current.x - tx) / sx,
          (mousePosition.current.y - ty) / sy
        ]

        if (shiftKeyIsDown) {
          changeTransform([umx - umx * sx, umy - umy * sy, sx, sy])
        }
      }}
      onWheel={e => {
        const direction = e.deltaY > 0 ? -1 : e.deltaY < 0 ? 1 : 0

        const [umx, umy] = [
          (mousePosition.current.x - tx) / sx,
          (mousePosition.current.y - ty) / sy
        ]

        const [nsx, nsy] = [
          Math.max(1, Math.min(10, sx * (1 + direction * 0.3))),
          Math.max(1, Math.min(10, sy * (1 + direction * 0.3)))
        ]

        changeTransform([umx - umx * nsx, umy - umy * nsy, nsx, nsy])

        e.preventDefault()
      }}
      style={{ width: "100%", height: "100%" }}
      ref={canvasEl}
    />
  )
}
