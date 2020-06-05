// @flow
import React from "react"
import Annotator from "../Annotator"

export default ({ onExit, images }) => {
  return <Annotator images={images} onExit={onExit} />
}
