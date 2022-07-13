import React, { Fragment } from "react";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
var theme = createTheme();
var Svg = styled("svg")(function (_ref) {
  var theme = _ref.theme;
  return {
    pointerEvents: "none",
    position: "absolute",
    zIndex: 1,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    "& text": {
      fill: "#fff"
    },
    "& path": {
      vectorEffect: "non-scaling-stroke",
      strokeWidth: 2,
      opacity: 0.5,
      stroke: "#FFF",
      fill: "none",
      strokeDasharray: 5,
      animationDuration: "4s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      animationPlayState: "running"
    }
  };
});
export var PointDistances = function PointDistances(_ref2) {
  var projectRegionBox = _ref2.projectRegionBox,
      regions = _ref2.regions,
      pointDistancePrecision = _ref2.pointDistancePrecision,
      realSize = _ref2.realSize;
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(Svg, null, regions.filter(function (r1) {
    return r1.type === "point";
  }).flatMap(function (r1, i1) {
    return regions.filter(function (r2, i2) {
      return i2 > i1;
    }).filter(function (r2) {
      return r2.type === "point";
    }).map(function (r2) {
      var pr1 = projectRegionBox(r1);
      var pr2 = projectRegionBox(r2);
      var prm = {
        x: (pr1.x + pr1.w / 2 + pr2.x + pr2.w / 2) / 2,
        y: (pr1.y + pr1.h / 2 + pr2.y + pr2.h / 2) / 2
      };
      var displayDistance;

      if (realSize) {
        var w = realSize.w,
            h = realSize.h,
            unitName = realSize.unitName;
        displayDistance = Math.sqrt(Math.pow(r1.x * w - r2.x * w, 2) + Math.pow(r1.y * h - r2.y * h, 2)).toFixed(pointDistancePrecision) + unitName;
      } else {
        displayDistance = (Math.sqrt(Math.pow(r1.x - r2.x, 2) + Math.pow(r1.y - r2.y, 2)) * 100).toFixed(pointDistancePrecision) + "%";
      }

      return React.createElement(Fragment, null, React.createElement("path", {
        d: "M".concat(pr1.x + pr1.w / 2, ",").concat(pr1.y + pr1.h / 2, " L").concat(pr2.x + pr2.w / 2, ",").concat(pr2.y + pr2.h / 2)
      }), React.createElement("text", {
        x: prm.x,
        y: prm.y
      }, displayDistance));
    });
  })));
};
export default PointDistances;