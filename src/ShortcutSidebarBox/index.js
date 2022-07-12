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
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"
import KeyboardIcon from '@material-ui/icons/Keyboard';
import { defaultHotkeys } from "../ShortcutsManager"

const useStyles = makeStyles({
  emptyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: grey[500],
    textAlign: "center",
    padding: 20,
  },
})

const listItemTextStyle = { paddingLeft: 16 }

export const HistorySidebarBox = ({
  history,
  onRestoreHistory,
}: {
  history: Array<{ name: string, time: Date }>,
}) => {
  const classes = useStyles()
  console.log(defaultHotkeys)
  return (
    <SidebarBoxContainer
      title="Shortcuts"
      icon={<KeyboardIcon style={{ color: grey[700] }} />}
      expandedByDefault
      noScroll
    >
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Action</TableCell>
              <TableCell align="center">Keyboard Shortcut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {defaultHotkeys.map(row => (
              row.binding?
              <TableRow>
              <TableCell>
                {row.description}
              </TableCell>
              <TableCell align="center">
                {row.binding.toUpperCase()}
              </TableCell>
            </TableRow>
            :
            null
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </SidebarBoxContainer>
  )
}

export default HistorySidebarBox;
