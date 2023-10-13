// @flow

import React, {memo} from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"
import SidebarBox from "react-material-workspace-layout/SidebarBox"

const theme = createTheme()
export const SidebarBoxContainer = ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault = false,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <SidebarBox icon={icon} title={title}>
        {children}
      </SidebarBox>
    </ThemeProvider>
  )
}

export default memo(
  SidebarBoxContainer,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
