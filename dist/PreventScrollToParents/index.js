import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import React, { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useEventCallback from "use-event-callback";
var theme = createTheme();
var Container = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    "& > div": {
      width: "100%",
      height: "100%"
    }
  };
});
export var PreventScrollToParents = function PreventScrollToParents(_ref2) {
  var children = _ref2.children,
      otherProps = _objectWithoutProperties(_ref2, ["children"]);

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      mouseOver = _useState2[0],
      changeMouseOver = _useState2[1];

  var onMouseMove = useEventCallback(function (e) {
    if (!mouseOver) changeMouseOver(true);

    if (otherProps.onMouseMove) {
      otherProps.onMouseMove(e);
    }
  });
  var onMouseLeave = useEventCallback(function (e) {
    setTimeout(function () {
      if (mouseOver) {
        changeMouseOver(false);
      }
    }, 100);
  });
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(Container, Object.assign({}, otherProps, {
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseLeave
  }), React.createElement(RemoveScroll, {
    enabled: mouseOver,
    removeScrollBar: false
  }, children)));
};
export default PreventScrollToParents;