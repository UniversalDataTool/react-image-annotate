import React, { useReducer, useEffect, useMemo } from "react"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import ButtonBase from "@mui/material/ButtonBase"
import ExpandIcon from "@mui/icons-material/KeyboardArrowLeft"
import ContractIcon from "@mui/icons-material/KeyboardArrowRight"
import { grey } from "@mui/material/colors"

const theme = createTheme()
const Container = styled("div")(({ theme }) => ({
  width: 0,
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flexShrink: 0,
  backgroundColor: "#fff",
  position: "relative",
  transition: "width 500ms",
  "&.expanded": {
    width: 300,
  },
}))

const Expander = styled(ButtonBase)(({ theme }) => ({
  width: 23,
  height: 40,
  display: "flex",
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "flex-start",
  borderTopLeftRadius: "50%",
  borderBottomLeftRadius: "50%",
  boxSizing: "border-box",
  borderTop: `1px solid ${grey[400]}`,
  borderBottom: `1px solid ${grey[400]}`,
  borderLeft: `1px solid ${grey[400]}`,
  boxShadow: "-1px 2px 5px rgba(0,0,0,0.2)",
  backgroundColor: "#fff",
  position: "absolute",
  top: "calc(50% - 20px)",
  left: -23,
  zIndex: 9999,
  transition: "opacity 500ms, left 500ms, width 500ms",
  "&.expanded": {
    left: -20,
    width: 20,
    opacity: 0.4,
    "& .icon": {
      marginLeft: 0,
    },
  },
  "& .icon": {
    marginLeft: 3,
  },
}))

const Slider = styled("div")(({ theme }) => ({
  position: "absolute",
  right: 0,
  top: 0,
  width: 0,
  bottom: 0,
  overflow: "hidden",
  transition: "opacity 500ms, left 500ms, width 500ms",
  "&.expanded": {
    width: 300,
  },
}))
const InnerSliderContent = styled("div")(({ theme }) => ({
  width: 300,
  position: "absolute",
  right: 0,
  top: 0,
  bottom: 0,
}))

const getInitialExpandedState = () => {
  try {
    return JSON.parse(window.localStorage.__REACT_WORKSPACE_LAYOUT_EXPANDED)
  } catch (e) {
    return window.innerWidth > 1000 ? true : false
  }
}

export const RightSidebar = ({ children, initiallyExpanded, height }) => {
  const [expanded, toggleExpanded] = useReducer(
    (state) => !state,
    initiallyExpanded === undefined
      ? getInitialExpandedState()
      : initiallyExpanded
  )

  useEffect(() => {
    if (initiallyExpanded === undefined) {
      window.localStorage.__REACT_WORKSPACE_LAYOUT_EXPANDED =
        JSON.stringify(expanded)
    }
  }, [initiallyExpanded, expanded])

  const containerStyle = useMemo(() => ({ height: height || "100%" }), [height])

  return (
    <ThemeProvider theme={theme}>
      <Container className={expanded ? "expanded" : ""} style={containerStyle}>
        <Slider className={expanded ? "expanded" : ""}>
          <InnerSliderContent>{children}</InnerSliderContent>
        </Slider>
        <Expander
          onClick={toggleExpanded}
          className={expanded ? "expanded" : ""}
        >
          {expanded ? (
            <ContractIcon className="icon" />
          ) : (
            <ExpandIcon className="icon" />
          )}
        </Expander>
      </Container>
    </ThemeProvider>
  )
}

export default RightSidebar
