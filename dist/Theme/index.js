import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
var useStyles = makeStyles(function (theme) {
  return {
    container: {
      fontFamily: '"Inter", sans-serif'
    }
  };
});
var theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif'
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none"
      }
    }
  }
});
export var Theme = function Theme(_ref) {
  var children = _ref.children;
  var classes = useStyles();
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement("div", null, children));
};
export default Theme;