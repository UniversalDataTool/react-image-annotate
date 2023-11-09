// @flow

import React, { setState, memo } from "react"
import { makeStyles } from "@material-ui/core/styles"
import SidebarBoxContainer from "../SidebarBoxContainer"
import HistoryIcon from "@material-ui/icons/History"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import IconButton from "@material-ui/core/IconButton"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import UndoIcon from "@material-ui/icons/Undo"
import moment from "moment"
import { grey } from "@material-ui/core/colors"
import isEqual from "lodash/isEqual"
import Box from "@material-ui/core/Box"
import { Typography } from "@material-ui/core"

const useStyles = makeStyles({
  emptyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    padding: 20,
  },
})

const listItemTextStyle = { paddingLeft: 16, color: "white" }

export const HistorySidebarBox = ({
  history,
  onRestoreHistory,
}: {
  history: Array<{ name: string, time: Date }>,
}) => {
  const classes = useStyles()

  return (
    <SidebarBoxContainer
      title="History"
      icon={<HistoryIcon style={{ color: "white" }} />}
    >
      <List>
        {history.length === 0 && (
          <div className={classes.emptyText}>No History Yet</div>
        )}
        {history.map(({ name, time }, i) => (
          <ListItem button dense key={i}>
            <ListItemText
              style={listItemTextStyle}
              disableTypography
              primary={
                <Typography variant="body2" style={{ color: "#FFFFFF" }}>
                  {name}
                </Typography>
              }
              secondary={
                <Typography variant="body2" style={{ color: "#FFFFFF" }}>
                  {moment(time).format("LT")}
                </Typography>
              }
            />
            {i === 0 && (
              <ListItemSecondaryAction onClick={() => onRestoreHistory()}>
                <IconButton
                  style={{
                    color: "white",
                  }}
                >
                  <UndoIcon />
                </IconButton>
              </ListItemSecondaryAction>
            )}
          </ListItem>
        ))}
      </List>
    </SidebarBoxContainer>
  )
}

export default memo(HistorySidebarBox, (prevProps, nextProps) =>
  isEqual(
    prevProps.history.map((a) => [a.name, a.time]),
    nextProps.history.map((a) => [a.name, a.time])
  )
)
