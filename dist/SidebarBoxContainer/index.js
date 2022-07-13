import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, memo } from "react";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import { grey } from "@mui/material/colors";
import classnames from "classnames";
import useEventCallback from "use-event-callback";
import SidebarBox from "react-material-workspace-layout/SidebarBox";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return {
    container: {
      margin: 8
    },
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
        overflowY: "visible",
        overflow: "visible"
      }
    }
  };
});
export var SidebarBoxContainer = function SidebarBoxContainer(_ref) {
  var icon = _ref.icon,
      title = _ref.title,
      subTitle = _ref.subTitle,
      children = _ref.children,
      _ref$noScroll = _ref.noScroll,
      noScroll = _ref$noScroll === void 0 ? false : _ref$noScroll,
      _ref$expandedByDefaul = _ref.expandedByDefault,
      expandedByDefault = _ref$expandedByDefaul === void 0 ? false : _ref$expandedByDefaul;
  var classes = useStyles();
  var content = React.createElement("div", {
    className: classnames(classes.expandedContent, noScroll && "noScroll")
  }, children);

  var _useState = useState(expandedByDefault),
      _useState2 = _slicedToArray(_useState, 2),
      expanded = _useState2[0],
      changeExpanded = _useState2[1];

  var toggleExpanded = useEventCallback(function () {
    return changeExpanded(!expanded);
  });
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(SidebarBox, {
    icon: icon,
    title: title
  }, children));
};
export default memo(SidebarBoxContainer, function (prev, next) {
  return prev.title === next.title && prev.children === next.children;
});