// @flow

import React, { useRef, useState } from "react"

export default () => {
  const canvasEl = useRef(null)

  return <canvas ref={canvasEl} />
}
