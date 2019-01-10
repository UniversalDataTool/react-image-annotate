// @flow
import React, { useRef, useState, useLayoutEffect } from "react"
import exampleImage from "./seves_desk.story.jpg"
import { Matrix } from "transformation-matrix-js"
import exampleMask from "./mouse_mask.story.png"
import getImageData from "get-image-data"
import type { Region } from "./region-tools.js"
import { getEnclosingBox } from "./region-tools.js"
import { makeStyles } from "@material-ui/styles"
import Paper from "@material-ui/core/Paper"
import { grey } from "@material-ui/core/colors"

const useStyles = makeStyles({
  "@keyframes borderDance": {
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: 100 }
  },
  highlightBox: {
    "& path": {
      vectorEffect: "non-scaling-stroke",
      strokeWidth: 2,
      stroke: "#FFF",
      fill: "none",
      strokeDasharray: 5,
      animationName: "$borderDance",
      animationDuration: "4s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      animationPlayState: "running"
    }
  },
  canvas: { width: "100%", height: "100%" },
  regionInfo: {
    position: "absolute",
    fontSize: 12,
    pointerEvents: "none",
    fontWeight: 600,
    color: grey[900],
    padding: 8,
    "& .name": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .circle": {
        marginRight: 4,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.4)",
        width: 10,
        height: 10,
        borderRadius: 5
      }
    },
    "& .tags": {
      "& .tag": {
        color: grey[700],
        display: "inline-block",
        margin: 1,
        fontSize: 10,
        textDecoration: "underline"
      }
    }
  }
})

const test = [
  {
    type: "point",
    name: "Paper",
    x: 0.8,
    y: 0.5,
    cls: "Something",
    color: "#f00",
    highlighted: true
  },
  {
    type: "point",
    name: "Dude's Head",
    tags: ["human", "head", "male"],
    x: 0.1,
    y: 0.15,
    cls: "Something",
    color: "#0F0",
    highlighted: true
  },
  {
    type: "box",
    name: "Business Card",
    highlighted: true,
    x: 0.315,
    y: 0.63,
    w: 0.067,
    h: 0.045,
    cls: "Something",
    color: "#ff0"
  },
  {
    type: "polygon",
    name: "Laptop",
    tags: ["Electronic Device"],
    highlighted: true,
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
    highlighted: true,
    sx: 0.7433,
    sy: 0.5847,
    w: 0.83 - 0.7433,
    h: 0.67 - 0.5847,
    src: exampleMask,
    cls: "Something",
    color: "#00f"
  }
]

type Props = {
  regions?: Array<Region>,
  onMouseMove?: ({ x: number, y: number }) => null,
  onMouseDown?: ({ x: number, y: number }) => null,
  onMouseUp?: ({ x: number, y: number }) => null,
  dragWithPrimary?: boolean
}

export default ({
  regions = test,
  onMouseMove = p => null,
  onMouseDown = p => null,
  onMouseUp = p => null,
  dragWithPrimary = false
}: Props) => {
  const classes = useStyles()

  const canvasEl = useRef(null)
  const image = useRef(null)
  const layoutParams = useRef({})
  const [imageLoaded, changeImageLoaded] = useState(false)
  const [dragging, changeDragging] = useState(false)
  const [maskImagesLoaded, changeMaskImagesLoaded] = useState(0)
  const mousePosition = useRef({ x: 0, y: 0 })
  const prevMousePosition = useRef({ x: 0, y: 0 })
  const [mat, changeMat] = useState(Matrix.from(1, 0, 0, 1, -10, -10))
  const maskImages = useRef({})

  const innerMousePos = mat.applyToPoint(
    mousePosition.current.x,
    mousePosition.current.y
  )

  const projectRegionBox = r => {
    const { iw, ih } = layoutParams.current
    const bbox = getEnclosingBox(r)
    const cbox = {
      x: bbox.x * iw - 15,
      y: bbox.y * ih - 15,
      w: bbox.w * iw + 30,
      h: bbox.h * ih + 30
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

    context.save()
    context.globalAlpha = mat.a * 0.5 + 0.5
    context.lineWidth = mat.a * 1 + 1
    if (context.globalAlpha > 0.6) {
      context.shadowColor = "black"
      context.shadowBlur = 4
    }
    for (const region of regions) {
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
    context.restore()
    context.restore()
  })

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {regions
        .filter(r => r.highlighted)
        .map((r, i) => {
          const pbox = projectRegionBox(r)
          return (
            <svg
              key={i}
              className={classes.highlightBox}
              style={{
                pointerEvents: "none",
                position: "absolute",
                left: pbox.x,
                top: pbox.y,
                width: pbox.w,
                height: pbox.h
              }}
            >
              <path
                d={`M5,5 L${pbox.w - 5},5 L${pbox.w - 5},${pbox.h -
                  5} L5,${pbox.h - 5} Z`}
              />
            </svg>
          )
        })}
      {regions
        .filter(r => r.name || r.tags)
        .map(region => {
          const pbox = projectRegionBox(region)
          const { iw, ih } = layoutParams.current
          return (
            <Paper
              className={classes.regionInfo}
              style={{
                left: pbox.x,
                bottom: ih - pbox.y + 18
              }}
            >
              {region.name && (
                <div className="name">
                  <div
                    className="circle"
                    style={{ backgroundColor: region.color }}
                  />
                  {region.name}
                </div>
              )}
              {region.tags && (
                <div className="tags">
                  {region.tags.map(t => (
                    <div key={t} className="tag">
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </Paper>
          )
        })}
      <canvas
        onMouseDown={e => {
          if (e.button === 1 || (e.button === 0 && dragWithPrimary))
            return changeDragging(true)
          if (e.button === 0)
            onMouseDown(
              mat
                .clone()
                .inverse()
                .applyToPoint(mousePosition.current.x, mousePosition.current.y)
            )
        }}
        onMouseUp={e => {
          if (e.button === 1 || (e.button === 0 && dragWithPrimary))
            return changeDragging(false)
          if (e.button === 0)
            onMouseUp(
              mat
                .clone()
                .inverse()
                .applyToPoint(mousePosition.current.x, mousePosition.current.y)
            )
        }}
        onMouseMove={e => {
          const { left, top } = e.target.getBoundingClientRect()
          prevMousePosition.current.x = mousePosition.current.x
          prevMousePosition.current.y = mousePosition.current.y
          mousePosition.current.x = e.clientX - left
          mousePosition.current.y = e.clientY - top

          onMouseMove(
            mat.applyToPoint(mousePosition.current.x, mousePosition.current.y)
          )

          if (dragging) {
            mat.translate(
              prevMousePosition.current.x - mousePosition.current.x,
              prevMousePosition.current.y - mousePosition.current.y
            )

            changeMat(mat)
          }
        }}
        onWheel={e => {
          const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0

          const [mx, my] = [mousePosition.current.x, mousePosition.current.y]

          // NOTE: We're mutating mat here
          mat.translate(mx, my).scaleU(1 + 0.2 * direction)
          if (mat.a > 2) mat.scaleU(2 / mat.a)
          if (mat.a < 0.1) mat.scaleU(0.1 / mat.a)
          mat.translate(-mx, -my)

          changeMat(mat)

          e.preventDefault()
        }}
        className={classes.canvas}
        ref={canvasEl}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          color: "#fff",
          opacity: 0.5,
          fontWeight: "bolder",
          fontSize: 14,
          padding: 4
        }}
      >
        {((1 / mat.a) * 100).toFixed(0)}%
      </div>
    </div>
  )
}
