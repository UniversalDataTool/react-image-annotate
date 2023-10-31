import React from "react"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import { grey } from "@mui/material/colors"

const theme = createTheme()
const Container = styled("div")(({ theme }) => ({
  position: "relative",
  flexGrow: 1,
  flexShrink: 1,
  height: "100%",
  backgroundColor: grey[50],
  overflowY: "auto",
}))
const ShadowOverlay = styled("div")(({ theme }) => ({
  content: "' '",
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: "none",
  boxShadow:
    "inset 0 3px 5px rgba(0,0,0,0.15), inset -3px 0 5px rgba(0,0,0,0.15), inset 3px 0 5px rgba(0,0,0,0.15)",
}))

export const WorkContainer = React.forwardRef(({ children }, ref) => {
  return (
    <ThemeProvider theme={theme}>
      <Container ref={ref}>
        {children}
        <ShadowOverlay />
      </Container>
    </ThemeProvider>
  )
})

export default WorkContainer
