// @flow

import React, { useState, memo, useCallback } from "react"
import Paper from "@mui/material/Paper"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import ExpandIcon from "@mui/icons-material/ExpandMore"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import classnames from "classnames"
import useEventCallback from "use-event-callback"
import Typography from "@mui/material/Typography"
import { useIconDictionary } from "../icon-dictionary.js"
import ResizePanel from "../ResizePanel"
import styles from "./styles.js"

const theme = createTheme()

const getExpandedFromLocalStorage = (title) => {
  try {
    return JSON.parse(
      window.localStorage[`__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`]
    )
  } catch (e) {
    return false
  }
}
const setExpandedInLocalStorage = (title, expanded) => {
  window.localStorage[`__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`] =
    JSON.stringify(expanded)
}

export const SidebarBox = ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault,
}) => {
  const content = (
    <div
      style={styles.expandedContent}
      className={classnames(noScroll && "noScroll")}
    >
      {children}
    </div>
  )

  const [expanded, changeExpandedState] = useState(
    expandedByDefault === undefined
      ? getExpandedFromLocalStorage(title)
      : expandedByDefault
  )
  const changeExpanded = useCallback(
    (expanded) => {
      changeExpandedState(expanded)
      setExpandedInLocalStorage(title, expanded)
    },
    [changeExpandedState, title]
  )

  const toggleExpanded = useEventCallback(() => changeExpanded(!expanded))
  const customIconMapping = useIconDictionary()
  const TitleIcon = customIconMapping[title.toLowerCase()]
  return (
    <ThemeProvider theme={theme}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div className="iconContainer">
            {icon || <TitleIcon sx={styles.titleIcon} />}
          </div>
          <Typography sx={styles.title}>
            {title} <span>{subTitle}</span>
          </Typography>
          <IconButton onClick={toggleExpanded} sx={styles.expandButton}>
            <ExpandIcon
              className={classnames("icon", expanded && "expanded")}
            />
          </IconButton>
        </div>
        {noScroll ? (
          expanded ? (
            content
          ) : null
        ) : (
          <Collapse in={expanded}>
            <ResizePanel direction="s" style={{ height: 200 }}>
              <div
                className="panel"
                style={{ display: "block", overflow: "hidden", height: 500 }}
              >
                {content}
              </div>
            </ResizePanel>
          </Collapse>
        )}
      </div>
    </ThemeProvider>
  )
}

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
