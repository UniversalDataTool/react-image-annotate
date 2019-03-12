// @flow

import React, { Fragment } from "react"

export default ({ x, y }: { x: number, y: number }) => {
  return (
    <Fragment>
      <div
        style={{
          position: "absolute",
          height: "100%",
          width: 1,
          backgroundColor: "#f00",
          left: x,
          pointerEvents: "none",
          top: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: 1,
          backgroundColor: "#f00",
          top: y,
          pointerEvents: "none",
          left: 0
        }}
      />
    </Fragment>
  )
}
