// @flow

import React, { useState } from "react"
import { RemoveScroll } from "react-remove-scroll"
import { styled } from "@material-ui/core/styles"

const Container = styled("div")({
  "& > div": {
    width: "100%",
    height: "100%"
  }
})

export default ({ children, ...otherProps }) => {
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <Container
      {...otherProps}
      onMouseEnter={e => changeMouseOver(true)}
      onMouseLeave={e => changeMouseOver(false)}
    >
      <RemoveScroll enabled={mouseOver} removeScrollBar={false}>
        {children}
      </RemoveScroll>
    </Container>
  )
}
