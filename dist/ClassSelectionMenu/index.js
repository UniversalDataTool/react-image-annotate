import React, { useEffect } from "react";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import * as muiColors from "@mui/material/colors";
import SidebarBoxContainer from "../SidebarBoxContainer";
import colors from "../colors";
import BallotIcon from "@mui/icons-material/Ballot";
import capitalize from "lodash/capitalize";
import classnames from "classnames";
var theme = createTheme();
var LabelContainer = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    display: "flex",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: "center",
    cursor: "pointer",
    opacity: 0.7,
    backgroundColor: "#fff",
    "&:hover": {
      opacity: 1
    },
    "&.selected": {
      opacity: 1,
      fontWeight: "bold"
    }
  };
});
var Circle = styled("div")(function (_ref2) {
  var theme = _ref2.theme;
  return {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 8
  };
});
var Label = styled("div")(function (_ref3) {
  var theme = _ref3.theme;
  return {
    fontSize: 11
  };
});
var DashSep = styled("div")(function (_ref4) {
  var theme = _ref4.theme;
  return {
    flexGrow: 1,
    borderBottom: "2px dotted ".concat(muiColors.grey[300]),
    marginLeft: 8,
    marginRight: 8
  };
});
var Number = styled("div")(function (_ref5) {
  var theme = _ref5.theme;
  return {
    fontSize: 11,
    textAlign: "center",
    minWidth: 14,
    paddingTop: 2,
    paddingBottom: 2,
    fontWeight: "bold",
    color: muiColors.grey[700]
  };
});
export var ClassSelectionMenu = function ClassSelectionMenu(_ref6) {
  var selectedCls = _ref6.selectedCls,
      regionClsList = _ref6.regionClsList,
      onSelectCls = _ref6.onSelectCls;
  useEffect(function () {
    var keyMapping = {};

    var _loop = function _loop(i) {
      keyMapping[i + 1] = function () {
        return onSelectCls(regionClsList[i]);
      };
    };

    for (var i = 0; i < 9 && i < regionClsList.length; i++) {
      _loop(i);
    }

    var onKeyDown = function onKeyDown(e) {
      if (keyMapping[e.key]) {
        keyMapping[e.key]();
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return function () {
      return window.removeEventListener("keydown", onKeyDown);
    };
  }, [regionClsList, selectedCls]);
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(SidebarBoxContainer, {
    title: "Classifications",
    subTitle: "",
    icon: React.createElement(BallotIcon, {
      style: {
        color: muiColors.grey[700]
      }
    }),
    expandedByDefault: true
  }, regionClsList.map(function (label, index) {
    return React.createElement(LabelContainer, {
      className: classnames({
        selected: label === selectedCls
      }),
      onClick: function onClick() {
        return onSelectCls(label);
      }
    }, React.createElement(Circle, {
      style: {
        backgroundColor: colors[index % colors.length]
      }
    }), React.createElement(Label, {
      className: classnames({
        selected: label === selectedCls
      })
    }, capitalize(label)), React.createElement(DashSep, null), React.createElement(Number, {
      className: classnames({
        selected: label === selectedCls
      })
    }, index < 9 ? "Key [".concat(index + 1, "]") : ""));
  }), React.createElement(Box, {
    pb: 2
  })));
};
export default ClassSelectionMenu;