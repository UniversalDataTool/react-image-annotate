// @flow

import React, { useState, useEffect, useMemo, useRef } from "react"
import { colorInts } from "../colors"
import { useDebounce } from "react-use"

import MMGC_INIT from "mmgc1-cpp"

export const ImageMask = ({
  regions,
  regionClsList,
  imageSrc,
  imagePosition,
  zIndex = 1,
  hide = false,
  autoSegmentationOptions = { type: "simple" },
}) => {
  if (!window.mmgc) window.mmgc = MMGC_INIT()
  const mmgc = window.mmgc
  const [canvasRef, setCanvasRef] = useState(null)

  const superPixelsGenerated = useRef(false)
  const [sampleImageData, setSampleImageData] = useState()

  useEffect(() => {
    if (!imageSrc) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const image = new Image()
    image.crossOrigin = "anonymous"
    image.src = imageSrc
    image.onload = () => {
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      ctx.drawImage(image, 0, 0)
      const imageData = ctx.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      )
      superPixelsGenerated.current = false
      setSampleImageData(imageData)
    }
  }, [imageSrc])

  useDebounce(
    () => {
      if (hide) return
      if (!canvasRef) return
      if (!sampleImageData) return
      if (regions.filter((cp) => cp.cls).length < 3) return
      if (!mmgc.setImageSize) return
      const context = canvasRef.getContext("2d")

      if (!superPixelsGenerated.current) {
        superPixelsGenerated.current = "processing"
        mmgc.setSimpleMode(autoSegmentationOptions.type === "simple")
        mmgc.setMaxClusters(1000)
        mmgc.setImageSize(sampleImageData.width, sampleImageData.height)
        mmgc.setClassColor(0, 0)
        for (let i = 0; i < colorInts.length; i++) {
          mmgc.setClassColor(i + 1, colorInts[i])
        }
        const imageAddress = mmgc.getImageAddr()
        mmgc.HEAPU8.set(sampleImageData.data, imageAddress)
        mmgc.computeSuperPixels()
        superPixelsGenerated.current = "done"
      }
      if (superPixelsGenerated.current !== "done") return

      // mmgc.setVerboseMode(true)
      if (
        !["bg", "background", "nothing"].includes(
          regionClsList[0].toLowerCase()
        )
      ) {
        console.log(
          `first region cls must be "bg" or "background" or "nothing"`
        )
        return
      }
      mmgc.clearClassElements()
      const classPoints = regions
        .filter((r) => r.type === "point")
        .filter((r) => r.cls)
      for (const classPoint of classPoints) {
        if (classPoint.x < 0 || classPoint.x >= 1) continue
        if (classPoint.y < 0 || classPoint.y >= 1) continue
        const clsIndex = regionClsList.indexOf(classPoint.cls)
        if (clsIndex > colorInts.length) {
          console.log("Too many classes to draw on mask!")
          continue
        }

        mmgc.addClassPoint(
          clsIndex,
          Math.floor(classPoint.y * sampleImageData.height),
          Math.floor(classPoint.x * sampleImageData.width)
        )
      }
      const classPolygons = regions
        .filter((r) => r.type === "polygon")
        .filter((r) => r.cls)
      for (const polygon of classPolygons) {
        const { points } = polygon
        const clsIndex = regionClsList.indexOf(polygon.cls)
        const pi = mmgc.addPolygon(clsIndex)
        const pointPairs = points.map((p, i) => [
          p,
          points[(i + 1) % points.length],
        ])
        for (const [p1, p2] of pointPairs) {
          const ri1 = Math.round(p1[1] * sampleImageData.height)
          const ci1 = Math.round(p1[0] * sampleImageData.width)
          const ri2 = Math.round(p2[1] * sampleImageData.height)
          const ci2 = Math.round(p2[0] * sampleImageData.width)
          mmgc.addLineToPolygon(pi, ri1, ci1, ri2, ci2)
        }
      }

      mmgc.computeMasks()
      const maskAddress = mmgc.getColoredMask()
      const cppImDataUint8 = new Uint8ClampedArray(
        mmgc.HEAPU8.buffer,
        maskAddress,
        sampleImageData.data.length
      )
      const maskImageData = new ImageData(
        cppImDataUint8,
        sampleImageData.width,
        sampleImageData.height
      )

      context.clearRect(0, 0, sampleImageData.width, sampleImageData.height)
      context.putImageData(maskImageData, 0, 0)
    },
    1000,
    [canvasRef, sampleImageData, regions, hide]
  )

  const style = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y
    return {
      display: hide ? "none" : undefined,
      imageRendering: "pixelated",
      transform: "translateZ(0px)",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      zIndex,
      position: "absolute",
      pointerEvents: "none",
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
    zIndex,
    hide,
  ])

  return (
    <canvas
      style={style}
      width={sampleImageData ? sampleImageData.width : 0}
      height={sampleImageData ? sampleImageData.height : 0}
      ref={setCanvasRef}
    />
  )
}

export default ImageMask
