// @flow
import React, { useRef, useState, useLayoutEffect } from "react"
import exampleImage from "./seves_desk.story.jpg"
import { Matrix } from "transformation-matrix-js"
import exampleMask from "./mouse_mask.story.png"
import getImageData from "get-image-data"

const test = [
  {
    type: "point",
    x: 0.8,
    y: 0.5,
    cls: "Something",
    color: "#f00",
    highlighted: true
  },
  { type: "point", x: 0.1, y: 0.15, cls: "Something", color: "#0F0" },
  {
    type: "box",
    x: 0.315,
    y: 0.63,
    w: 0.067,
    h: 0.045,
    cls: "Something",
    color: "#ff0"
  },
  {
    type: "polygon",
    points: [
      [0.4019, 0.5065],
      [0.407, 0.5895],
      [0.4157, 0.6801],
      [0.6579, 0.656],
      [0.6115, 0.5674],
      [0.5792, 0.4895]
    ],
    cls: "Something",
    color: "#f0f"
  },
  {
    type: "polygon",
    incomplete: true,
    points: [
      [0.1201, 0.5987],
      [0.0674, 0.7063],
      [0.0726, 0.7477],
      [0.2132, 0.7311]
    ],
    cls: "Something",
    color: "#00f"
  },
  {
    type: "pixel",
    sx: 0.7433,
    sy: 0.5847,
    w: 0.83 - 0.7433,
    h: 0.67 - 0.5847,
    src: exampleMask,
    cls: "Something",
    color: "#00f"
  }
]

export default ({ regions = test }) => {
  const canvasEl = useRef(null)
  const image = useRef(null)
  const layoutParams = useRef({})
  const [imageLoaded, changeImageLoaded] = useState(false)
  const [mouseDown, changeMouseDown] = useState(false)
  const [maskImagesLoaded, changeMaskImagesLoaded] = useState(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const prevMousePosition = useRef({ x: 0, y: 0 })
  const [mat, changeMat] = useState(Matrix.from(1, 0, 0, 1, -10, -10))
  const maskImages = useRef({})

  const innerMousePos = mat.applyToPoint(
    mousePosition.current.x,
    mousePosition.current.y
  )

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

    for (const region of regions) {
      switch (region.type) {
        case "point": {
          context.save()
          context.shadowColor = "black"
          context.shadowBlur = 4
          context.beginPath()
          context.arc(region.x * iw, region.y * ih, 5, 0, 2 * Math.PI)
          context.strokeStyle = region.color
          context.lineWidth = 2
          context.stroke()
          context.globalAlpha = 1
          context.lineWidth = 2
          context.moveTo(region.x * iw - 10, region.y * ih)
          context.lineTo(region.x * iw - 2, region.y * ih)
          context.moveTo(region.x * iw + 10, region.y * ih)
          context.lineTo(region.x * iw + 2, region.y * ih)
          context.moveTo(region.x * iw, region.y * ih - 10)
          context.lineTo(region.x * iw, region.y * ih - 2)
          context.moveTo(region.x * iw, region.y * ih + 10)
          context.lineTo(region.x * iw, region.y * ih + 2)
          context.stroke()
          context.restore()
          break
        }
        case "box": {
          context.save()

          context.shadowColor = "black"
          context.shadowBlur = 4
          context.lineWidth = 2
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
          context.lineWidth = 2
          context.strokeStyle = region.color

          context.beginPath()
          context.moveTo(region.points[0][0] * iw, region.points[0][1] * ih)
          for (const point of region.points) {
            context.lineTo(point[0] * iw, point[1] * ih)
          }
          if (!region.incomplete) context.closePath()
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
                imgData.data[i] = black ? 255 : 0
                imgData.data[i + 1] = 0
                imgData.data[i + 2] = 0
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

    // context.fillStyle = "#000"
    // context.fillRect(200, 200, 50, 50)

    context.restore()
  })

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
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
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "#fff",
          fontSize: 8
        }}
      >
        [{((innerMousePos.x / layoutParams.current.iw) * 100).toFixed(2)}%,{" "}
        {((innerMousePos.y / layoutParams.current.ih) * 100).toFixed(2)}%]
      </div>
    </div>
  )
}
