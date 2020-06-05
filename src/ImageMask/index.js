// @flow

import React, { useState, useEffect, useMemo } from "react"

export default ({ imageData, maskVersion, opacity = 0.5 }) => {
  const [canvasRef, setCanvasRef] = useState(null)

  useEffect(() => {
    if (!canvasRef) return
    const context = canvasRef.getContext("2d")
    context.putImageData(imageData, 0, 0)
  }, [canvasRef, imageData, maskVersion])

  const style = useMemo(() => ({ opacity }), [opacity])

  return (
    <canvas
      style={style}
      width={imageData.width}
      height={imageData.height}
      ref={setCanvasRef}
    />
  )
}
