// @flow

import React, { setState } from "react"
import { makeStyles } from "@material-ui/styles"
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

const useStyles = makeStyles({})

export default () => {
  const classes = useStyles()

  const actions = [
    { name: "Added Region", time: moment().subtract("30", "secs") },
    { name: 'Labelled Region "Car"', time: moment().subtract("30", "secs") }
  ]
  return (
    <SidebarBoxContainer
      title="History"
      icon={<HistoryIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <List>
        {actions.map(({ name, time }, i) => (
          <ListItem button dense key={i}>
            <ListItemText
              primary={name}
              secondary={moment(time).format("LT")}
            />
            {i === 0 && (
              <ListItemSecondaryAction>
                <IconButton>
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
