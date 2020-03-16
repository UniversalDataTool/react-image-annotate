// @flow

import React from "react"
import ReactFullscreen from "react-full-screen"

export const Fullscreen = props => {
  if (!props.enabled) return props.children
  return <ReactFullscreen {...props}>{props.children}</ReactFullscreen>
}

export default Fullscreen
