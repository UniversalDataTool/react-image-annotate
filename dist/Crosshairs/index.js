import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, useEffect, useState } from "react";
export var Crosshairs = function Crosshairs(_ref) {
  var mousePosition = _ref.mousePosition,
      x = _ref.x,
      y = _ref.y;

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      forceRenderState = _useState2[0],
      changeForceRenderState = _useState2[1];

  if (mousePosition) {
    x = mousePosition.current.x;
    y = mousePosition.current.y;
  }

  useEffect(function () {
    if (!mousePosition) return;
    var interval = setInterval(function () {
      if (x !== mousePosition.current.x || y !== mousePosition.current.y) {
        changeForceRenderState([mousePosition.current.x, mousePosition.current.y]);
      }
    }, 10);
    return function () {
      return clearInterval(interval);
    };
  });
  return React.createElement(Fragment, null, React.createElement("div", {
    style: {
      position: "absolute",
      height: "100%",
      width: 1,
      zIndex: 10,
      backgroundColor: "#f00",
      left: x,
      pointerEvents: "none",
      top: 0
    }
  }), React.createElement("div", {
    style: {
      position: "absolute",
      width: "100%",
      zIndex: 10,
      height: 1,
      backgroundColor: "#f00",
      top: y,
      pointerEvents: "none",
      left: 0
    }
  }));
};
export default Crosshairs;