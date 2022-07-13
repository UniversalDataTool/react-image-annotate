import React, { memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import DescriptionIcon from "@mui/icons-material/Description";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import Markdown from "react-markdown";
var theme = createTheme();
var MarkdownContainer = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 12,
    "& h1": {
      fontSize: 18
    },
    "& h2": {
      fontSize: 14
    },
    "& h3": {
      fontSize: 12
    },
    "& h4": {
      fontSize: 12
    },
    "& h5": {
      fontSize: 12
    },
    "& h6": {
      fontSize: 12
    },
    "& p": {
      fontSize: 12
    },
    "& a": {},
    "& img": {
      width: "100%"
    }
  };
});
export var TaskDescriptionSidebarBox = function TaskDescriptionSidebarBox(_ref2) {
  var description = _ref2.description;
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(SidebarBoxContainer, {
    title: "Task Description",
    icon: React.createElement(DescriptionIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: description && description !== "" ? false : true
  }, React.createElement(MarkdownContainer, null, React.createElement(Markdown, {
    source: description
  }))));
};
export default memo(TaskDescriptionSidebarBox);