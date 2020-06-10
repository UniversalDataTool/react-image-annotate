// @flow

import React, { useState, useEffect, useMemo, useRef } from "react"

import mmgc from "mmgc1-cpp"

console.log(mmgc)

export default ({
  classPoints,
  regionClsList,
  imageSrc,
  imagePosition,
  opacity = 0.5,
  zIndex = 999,
  position = "absolute",
}) => {
  const [canvasRef, setCanvasRef] = useState(null)
  
  const lastTimeMMGCRun = useRef(0);
  const superPixelsGenerated = useRef(false)
  const [sampleImageData, setSampleImageData] = useState()
  
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      ctx.width = image.naturalWidth
      ctx.height = image.naturalHeight
      ctx.drawImage(image, 0, 0);
      const imageData = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight)
      superPixelsGenerated.current = false;
      setSampleImageData(imageData)
    }
  }, [imageSrc])
  

  useEffect(() => {
    if (!canvasRef) return
    if (!sampleImageData) return
    if (!mmgc.setImage) return
    // NEEDS DEBOUNCE
    if (Date.now() < lastTimeMMGCRun.current + 500) return
    lastTimeMMGCRun.current = Date.now()
    const context = canvasRef.getContext("2d")
    
    console.log("got the sample image data and ready to mmgc!")
    
    if (!superPixelsGenerated.current) {
      console.log("generating super pixels...")
      mmgc.setImage(sampleImageData.data, sampleImageData.width, sampleImageData.height);
      mmgc.computeSuperPixels()
      superPixelsGenerated.current = true
    }
  
    // mmgc.setClassColor(0, 0xffffffff)
    // mmgc.setClassColor(1, 0x00000000)
    console.log("generating mask...")
    mmgc.clearClassPoints()
    for (const classPoint of classPoints) {
      if (!classPoint.cls) continue
      if (classPoint.x < 0) continue
      ///etc...
      console.log(
        regionClsList.indexOf(classPoint.cls), Math.floor(
        classPoint.y * sampleImageData.height
        ), Math.floor(classPoint.x * sampleImageData.width
        )
      )
      mmgc.addClassPoint(regionClsList.indexOf(classPoint.cls), Math.floor(
        classPoint.y * sampleImageData.height
        ), Math.floor(classPoint.x * sampleImageData.width
      ))
    }
    // mmgc.addClassPoint(0, 100, 125)
    // mmgc.addClassPoint(1, 10, 10)
    // mmgc.addClassPoint(1, 240, 300)
    mmgc.computeMasks()
    const maskAddress = mmgc.getColoredMask()
    const cppImDataUint8 = new Uint8Array(
      mmgc.HEAPU8.buffer,
      maskAddress,
      sampleImageData.data.length
      // sampleImageData.width * sampleImageData.height * 4
    )
    const clampedArray = Uint8ClampedArray.from(cppImDataUint8)
    
    window.uint8Arrays = (window.uint8Arrays || []).concat([cppImDataUint8])
    
    const maskImageData = new ImageData(clampedArray, sampleImageData.width, sampleImageData.height)

    // for (const i = 0; i < cppImDataUint8.length;i++){
    //   sampleImageData.data[i] = cppImDataUint8[i]
    // }
    console.log(maskImageData.data)
    context.clearRect(0,0,sampleImageData.width, sampleImageData.height)
    context.putImageData(maskImageData, 0, 0)
  }, [canvasRef, sampleImageData, JSON.stringify(classPoints.map(c => [c.x, c.y, c.cls]))])

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
      pointerEvents: "none",
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
    zIndex,
    position,
    opacity,
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
