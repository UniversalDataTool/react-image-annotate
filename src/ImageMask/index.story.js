// @flow

import React, { useState, useEffect, useReducer } from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageMask from "./"

const [width, height] = [200, 200]

const uint8Array = new Uint8ClampedArray(4 * width * width)

for (let ri = 0; ri < width; ri++) {
  for (let ci = 0; ci < height; ci++) {
    uint8Array[(ri * width + ci) * 4 + 0] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 1] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 2] = Math.floor(Math.random() * 256)
    uint8Array[(ri * width + ci) * 4 + 3] = 255
  }
}

const imageData = new ImageData(uint8Array, width, width)

storiesOf("ImageMask", module)
  .add("Basic", () => <ImageMask imageData={imageData} />)
  .add("Changing", () => {
    const [version, incVersion] = useReducer((state) => state + 1, 0)

    // Notice how you don't need to allocate new memory
    useEffect(() => {
      setInterval(() => {
        for (let i = 0; i < uint8Array.length; i++) {
          if (i % 4 !== 3) {
            uint8Array[i] = Math.floor(Math.random() * 256)
          }
        }
        incVersion()
      }, 500)
    }, [])
    return <ImageMask maskVersion={version} imageData={imageData} />
  })
