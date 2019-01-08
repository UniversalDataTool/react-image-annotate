// @flow
import React, { useRef, useState, useLayoutEffect } from "react"
import exampleImage from "./seves_desk.story.jpg"
import { Matrix } from "transformation-matrix-js"

export default () => {
  const canvasEl = useRef(null)
  const image = useRef(null)
  const [imageLoaded, changeImageLoaded] = useState(false)
  const [mouseDown, changeMouseDown] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })
  const prevMousePosition = useRef({ x: 0, y: 0 })
  const [mat, changeMat] = useState(Matrix.from(1, 0, 0, 1, 0, 0))

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
    context.transform(
      ...mat
        .clone()
        .inverse()
        .toArray()
    )

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
    // context.fillStyle = "#000"
    // context.fillRect(200, 200, 50, 50)

    context.restore()
  })

  return (
    <canvas
      onMouseDown={e => changeMouseDown(true)}
      onMouseUp={e => changeMouseDown(false)}
      onMouseMove={e => {
        const { left, top } = e.target.getBoundingClientRect()
        prevMousePosition.current.x = mousePosition.current.x
        prevMousePosition.current.y = mousePosition.current.y
        mousePosition.current.x = e.clientX - left
        mousePosition.current.y = e.clientY - top
        if (mouseDown) {
          changeMat(
            mat
              .clone()
              .translate(
                prevMousePosition.current.x - mousePosition.current.x,
                prevMousePosition.current.y - mousePosition.current.y
              )
          )
        }
      }}
      onWheel={e => {
        const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0

        const [mx, my] = [mousePosition.current.x, mousePosition.current.y]

        const newMat = mat
          .clone()
          .translate(mx, my)
          .scaleU(1 + 0.2 * direction)
        if (newMat.a > 2) newMat.scaleU(2 / newMat.a)
        if (newMat.a < 0.1) newMat.scaleU(0.1 / newMat.a)
        newMat.translate(-mx, -my)

        changeMat(newMat)

        e.preventDefault()
      }}
      style={{ width: "100%", height: "100%" }}
      ref={canvasEl}
    />
  )
}
