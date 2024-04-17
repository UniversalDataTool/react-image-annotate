// @flow

import React, { useState, memo, useCallback } from "react"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import ExpandIcon from "@mui/icons-material/ExpandMore"
import IconButton from "@mui/material/IconButton"
import Collapse from "@mui/material/Collapse"
import classnames from "classnames"
import useEventCallback from "use-event-callback"
import Typography from "@mui/material/Typography"
import { useIconDictionary } from "../icon-dictionary.js"
import styles from "./styles.js"

const theme = createTheme()
const ContainerDiv = styled('div')(() => styles.container)
const HeaderDiv = styled('div')(() => styles.header)
const ContentDiv = styled('div')(() => styles.expandedContent)
const TitleTypography = styled(Typography)(() => styles.title)

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
  noScroll,
  expandedByDefault,
}) => {
  const content = (
    <ContentDiv
      className={classnames(noScroll && "noScroll")}
    >
      {children}
    </ContentDiv>
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
      <ContainerDiv>
        <HeaderDiv>
          <div className="iconContainer">
            {icon || <TitleIcon />}
          </div>
          <TitleTypography>
            {title} <span>{subTitle}</span>
          </TitleTypography>
          <IconButton onClick={toggleExpanded} sx={styles.expandButton}>
            <ExpandIcon
              className={classnames("icon", expanded && "expanded")}
            />
          </IconButton>
        </HeaderDiv>
        {noScroll ? (
          expanded ? (
            content
          ) : null
        ) : (
          <Collapse in={expanded} >
              <div
                className="panel"
                style={{ display: "block", overflow: "hidden", height: 300 }}
              >
                {content}
              </div>
          </Collapse>
        )}
      </ContainerDiv>
    </ThemeProvider>
  )
}

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
)
