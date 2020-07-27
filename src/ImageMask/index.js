// @flow

import React, { useState, useEffect, useMemo, useRef } from "react"
import { colorInts } from "../colors"
import { useDebounce } from "react-use"
import loadImage from "./load-image"
import autoseg from "autoseg/webworker"

function convertToUDTRegions(regions) {
  return regions
    .map((r) => {
      switch (r.type) {
        case "point": {
          return {
            regionType: "point",
            classification: r.cls,
            x: r.x,
            y: r.y,
          }
        }
        case "polygon": {
          return {
            regionType: "polygon",
            classification: r.cls,
            points: r.points.map(([x, y]) => ({ x, y })),
          }
        }
        case "box": {
          return {
            regionType: "bounding-box",
            classification: r.cls,
            centerX: r.x + r.w / 2,
            centerY: r.y + r.h / 2,
            width: r.w,
            height: r.h,
          }
        }
        default: {
          return null
        }
      }
    })
    .filter(Boolean)
}

export const ImageMask = ({
  regions,
  regionClsList,
  imageSrc,
  imagePosition,
  zIndex = 1,
  hide = false,
  autoSegmentationOptions = { type: "simple" },
}) => {
  // if (!window.mmgc) window.mmgc = MMGC_INIT()
  // const mmgc = window.mmgc
  const [canvasRef, setCanvasRef] = useState(null)

  const [sampleImageData, setSampleImageData] = useState()

  useEffect(() => {
    if (!imageSrc) return

    loadImage(imageSrc).then((imageData) => {
      autoseg.setConfig({
        classNames: regionClsList,
        ...autoSegmentationOptions,
      })
      autoseg.loadImage(imageData)
      setSampleImageData(imageData)
    })
  }, [imageSrc])

  useDebounce(
    () => {
      if (hide) return
      if (!canvasRef) return
      if (!sampleImageData) return
      if (regions.filter((cp) => cp.cls).length < 2) return

      const udtRegions = convertToUDTRegions(regions)

      autoseg.getMask(udtRegions).then((maskImageData) => {
        const context = canvasRef.getContext("2d")
        context.clearRect(0, 0, maskImageData.width, maskImageData.height)
        context.putImageData(maskImageData, 0, 0)
      })
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
