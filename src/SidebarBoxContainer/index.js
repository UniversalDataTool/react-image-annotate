// @flow

import React, { useState } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/styles"
import ExpandIcon from "@material-ui/icons/ExpandMore"
import IconButton from "@material-ui/core/IconButton"
import Collapse from "@material-ui/core/Collapse"
import { grey } from "@material-ui/core/colors"
import classnames from "classnames"

const useStyles = makeStyles({
  container: { margin: 8 },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    flexGrow: 1,
    paddingLeft: 8,
    color: grey[800],
    "& span": {
      color: grey[600],
      fontSize: 12
    }
  },
  expandButton: {
    padding: 0,
    width: 30,
    height: 30,
    "& .icon": {
      marginTop: -6,
      width: 20,
      height: 20,
      transition: "500ms transform",
      "&.expanded": {
        transform: "rotate(180deg)"
      }
    }
  },
  expandedContent: {
    maxHeight: 300,
    overflowY: "auto",
    "&.noScroll": {
      overflowY: "visible"
    }
  }
})

export default ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault = false
}) => {
  const classes = useStyles()
  const [expanded, changeExpanded] = useState(expandedByDefault)
  return (
    <Paper className={classes.container}>
      <div className={classes.header}>
        {icon}
        <div className={classes.title}>
          {title} <span>{subTitle}</span>
        </div>
        <IconButton
          onClick={() => changeExpanded(!expanded)}
          className={classes.expandButton}
        >
          <ExpandIcon className={classnames("icon", expanded && "expanded")} />
        </IconButton>
      </div>
      <Collapse in={expanded}>
        <div
          className={classnames(
            classes.expandedContent,
            noScroll && "noScroll"
          )}
        >
          {children}
        </div>
      </Collapse>
    </Paper>
  )
}
