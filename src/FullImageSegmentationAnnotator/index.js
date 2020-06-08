// @flow
import React from "react"
import Annotator from "../Annotator"

const [width, height] = [200, 200]

// TODO remove this !!!!
const uint8Array = new Uint8ClampedArray(4 * width * height)

for (let ri = 0; ri < width; ri++) {
  for (let ci = 0; ci < height; ci++) {
    uint8Array[(ri * width + ci) * 4 + 0] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 1] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 2] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 3] = 255
  }
}

const imageData = new ImageData(uint8Array, width, height)
// TODO remove this !!!!

export default ({ onExit, images }) => {
  return (
    <Annotator
      images={images}
      onExit={onExit}
      fullImageSegmentationMode={true}
    />
  )
}
