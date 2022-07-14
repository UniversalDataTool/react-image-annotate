import React, { setState, memo } from "react";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SidebarBoxContainer from "../SidebarBoxContainer";
import HistoryIcon from "@mui/icons-material/History";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import UndoIcon from "@mui/icons-material/Undo";
import moment from "moment";
import { grey } from "@mui/material/colors";
import isEqual from "lodash/isEqual";
import Box from "@mui/material/Box";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return {
    emptyText: {
      fontSize: 14,
      fontWeight: "bold",
      color: grey[500],
      textAlign: "center",
      padding: 20
    }
  };
});
var listItemTextStyle = {
  paddingLeft: 16
};
export var HistorySidebarBox = function HistorySidebarBox(_ref) {
  var history = _ref.history,
      onRestoreHistory = _ref.onRestoreHistory;
  var classes = useStyles();
  return React.createElement(ThemeProvider, {
    theme: theme
  });
};
export default memo(HistorySidebarBox, function (prevProps, nextProps) {
  return isEqual(prevProps.history.map(function (a) {
    return [a.name, a.time];
  }), nextProps.history.map(function (a) {
    return [a.name, a.time];
  }));
});