// @flow

import React, {memo} from "react"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import SidebarBoxContainer from "../SidebarBoxContainer"
import HistoryIcon from "@mui/icons-material/History"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction"
import UndoIcon from "@mui/icons-material/Undo"
import moment from "moment"
import {grey} from "@mui/material/colors"
import isEqual from "lodash/isEqual"
import {useTranslation} from "react-i18next"

const theme = createTheme()
const EmptyTextDiv = styled('div')(() => ({
  fontSize: 14,
  fontWeight: "bold",
  color: grey[500],
  textAlign: "center",
  padding: 20,
}))

const listItemTextStyle = {paddingLeft: 16}

export const HistorySidebarBox = ({
  history,
  onRestoreHistory,
}) => {

  const {t} = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title={t("menu.history")}
        icon={<HistoryIcon style={{color: grey[700]}} />}
        expandedByDefault
      >
        <List>
          {history.length === 0 && (
            <EmptyTextDiv>No History Yet</EmptyTextDiv>
          )}
          {history.map(({name, time}, i) => (
            <ListItem button dense key={i}>
              <ListItemText
                style={listItemTextStyle}
                primary={name}
                secondary={moment(time).format("LT")}
              />
              {i === 0 && (
                <ListItemSecondaryAction onClick={() => onRestoreHistory()}>
                  <IconButton>
                    <UndoIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
        </List>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default memo(HistorySidebarBox, (prevProps, nextProps) =>
  isEqual(
    prevProps.history.map((a) => [a.name, a.time]),
    nextProps.history.map((a) => [a.name, a.time])
  )
)
