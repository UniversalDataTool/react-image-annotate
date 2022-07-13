import React from "react";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return {
    shortcutKeyFieldWrapper: {
      paddingTop: 8,
      display: "inline-flex",
      width: "100%"
    },
    shortcutKeyText: {
      lineHeight: 0
    },
    shortcutTextfield: {
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center"
    }
  };
});

var ShortcutField = function ShortcutField(_ref) {
  var actionId = _ref.actionId,
      actionName = _ref.actionName,
      keyName = _ref.keyName,
      onChangeShortcut = _ref.onChangeShortcut;
  var classes = useStyles();
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement("div", {
    className: classes.shortcutKeyFieldWrapper
  }, React.createElement(TextField, {
    variant: "outlined",
    label: actionName,
    className: classes.shortcutTextfield,
    value: keyName,
    onKeyPress: function onKeyPress(e) {
      onChangeShortcut(actionId, e.key);
      e.stopPropagation();
    }
  })));
};

export default ShortcutField;