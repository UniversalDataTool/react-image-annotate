// @flow
import React from "react"
import Annotator from "../Annotator"


const [width, height] = [200, 200]

export default ({ onExit, images }) => {
  return (
    <Annotator
      regionClsList={["cat", "dog"]}
      images={images}
      onExit={onExit}
      fullImageSegmentationMode={true}
    />
  )
}
