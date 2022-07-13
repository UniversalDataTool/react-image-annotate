import React, { createContext, useContext, memo } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { blue } from "@mui/material/colors";
export var SelectedTool = createContext();
export var SmallToolButton = function SmallToolButton(_ref) {
  var id = _ref.id,
      name = _ref.name,
      icon = _ref.icon,
      selected = _ref.selected,
      togglable = _ref.togglable,
      _ref$alwaysShowing = _ref.alwaysShowing,
      alwaysShowing = _ref$alwaysShowing === void 0 ? false : _ref$alwaysShowing;

  var _useContext = useContext(SelectedTool),
      enabledTools = _useContext.enabledTools,
      selectedTool = _useContext.selectedTool,
      onClickTool = _useContext.onClickTool;

  if (!enabledTools.includes(id) && !alwaysShowing) return null;
  selected = selected || selectedTool === id;
  return React.createElement(Tooltip, {
    placement: "right",
    title: name
  }, React.createElement("div", null, React.createElement(IconButton, {
    disabled: !togglable ? selected : undefined,
    "aria-label": name,
    onClick: function onClick() {
      return onClickTool(id);
    },
    size: "small",
    style: {
      width: 50,
      height: 50,
      margin: 1,
      color: selected ? blue[500] : undefined
    }
  }, icon)));
};
export default memo(SmallToolButton, function (prevProps, nextProps) {
  return prevProps.togglable === nextProps.togglable && prevProps.selected === nextProps.selected && prevProps.name === nextProps.name && prevProps.id === nextProps.id;
});