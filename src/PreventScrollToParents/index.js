// @flow

import React, { useState } from "react"
import { RemoveScroll } from "react-remove-scroll"

export default ({ children }) => {
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
    >
      <RemoveScroll enabled={mouseOver} removeScrollBar={false}>
        {children}
      </RemoveScroll>
    </div>
  )
}
