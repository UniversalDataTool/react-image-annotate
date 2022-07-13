import React from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
export var DebugSidebarBox = function DebugSidebarBox(_ref) {
  var state = _ref.state,
      lastAction = _ref.lastAction;
  var image = (state.images || [])[state.selectedImage];
  var region = image ? (image.regions || []).filter(function (r) {
    return r.highlighted;
  }) : null;
  return React.createElement(SidebarBoxContainer, {
    title: "Debug",
    icon: React.createElement("span", null),
    expandedByDefault: true
  }, React.createElement("div", {
    style: {
      padding: 4
    }
  }, React.createElement("div", null, React.createElement("b", null, "region"), ":"), React.createElement("pre", null, JSON.stringify(region, null, "  ")), React.createElement("div", null, React.createElement("b", null, "lastAction"), ":"), React.createElement("pre", null, JSON.stringify(lastAction, null, "  ")), React.createElement("div", null, React.createElement("b", null, "mode"), ":"), React.createElement("pre", null, JSON.stringify(state.mode, null, "  ")), React.createElement("div", null, React.createElement("b", null, "frame:")), React.createElement("pre", null, JSON.stringify(state.selectedImageFrameTime, null, "  "))));
};
export default DebugSidebarBox;