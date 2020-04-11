// @flow

import React, { useState } from "react"
import { RemoveScroll } from "react-remove-scroll"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"

const Container = styled("div")({
  "& > div": {
    width: "100%",
    height: "100%",
  },
})

export const PreventScrollToParents = ({ children, ...otherProps }) => {
  const [mouseOver, changeMouseOver] = useState(false)
  const onMouseMove = useEventCallback((e) => {
    if (!mouseOver) changeMouseOver(true)
    if (otherProps.onMouseMove) {
      otherProps.onMouseMove(e)
    }
  })
  const onMouseLeave = useEventCallback((e) => {
    setTimeout(() => {
      if (mouseOver) {
        changeMouseOver(false)
      }
    }, 100)
  })

  return (
    <Container
      {...otherProps}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <RemoveScroll enabled={mouseOver} removeScrollBar={false}>
        {children}
      </RemoveScroll>
    </Container>
  )
}

export default PreventScrollToParents
