// @flow

import React from "react"
import Fullscreen from "react-full-screen"

export default props => {
  if (!props.enabled) return props.children
  return <Fullscreen {...props}>{props.children}</Fullscreen>
}
