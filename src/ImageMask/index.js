// @flow

import React, { useState, useEffect, useMemo } from "react"
export default ({ imageData, imagePosition, videoPlaying, maskVersion, pointerEvents = "none", opacity = 0.5, zIndex = 999, position = 'absolute'}) => {
  const [canvasRef, setCanvasRef] = useState(null)

  useEffect(() => {
    if (!canvasRef) return
    const context = canvasRef.getContext("2d")
    context.putImageData(imageData, 0, 0)
  }, [canvasRef, imageData, maskVersion])

  const style = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y
    return {
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      zIndex,
      position,
      opacity,
      pointerEvents
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
    zIndex,
    position,
    opacity,
    pointerEvents
  ])

  return (
    <canvas
      style={style}
      width={imageData.width}
      height={imageData.height}
      ref={setCanvasRef}
    />
  )
}
