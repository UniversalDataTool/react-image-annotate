import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { setIn } from "seamless-immutable";
import ShortcutField from "./ShortcutField";
var defaultShortcuts = {
  select: {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Select Region",
    key: "Escape"
  },
  zoom: {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Zoom In/Out",
    key: "z"
  },
  "create-point": {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Create Point"
  },
  "create-box": {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Add Bounding Box",
    key: "b"
  },
  pan: {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Pan"
  },
  "create-polygon": {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Create Polygon"
  },
  "create-pixel": {
    action: {
      type: "SELECT_TOOL"
    },
    name: "Create Pixel"
  },
  "prev-image": {
    action: {
      type: "HEADER_BUTTON_CLICKED",
      buttonName: "Prev"
    },
    name: "Previous Image",
    key: "a"
  },
  "next-image": {
    action: {
      type: "HEADER_BUTTON_CLICKED",
      buttonName: "Next"
    },
    name: "Next Image",
    key: "d" //"ArrowRight"

  }
};
export default (function (_ref) {
  var onShortcutActionDispatched = _ref.onShortcutActionDispatched;

  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      shortcuts = _useState2[0],
      setShortcuts = _useState2[1]; // useLocalStorage


  useEffect(function () {
    var newShortcuts = _objectSpread({}, shortcuts);

    for (var _i = 0, _Object$keys = Object.keys(defaultShortcuts); _i < _Object$keys.length; _i++) {
      var actionId = _Object$keys[_i];

      if (!newShortcuts[actionId]) {
        newShortcuts[actionId] = defaultShortcuts[actionId];
      }
    }

    setShortcuts(newShortcuts);
  }, []);

  var onChangeShortcut = function onChangeShortcut(actionId, keyName) {
    setShortcuts(setIn(shortcuts, [actionId, "key"], keyName));
  };

  useEffect(function () {
    var handleKeyPress = function handleKeyPress(e) {
      for (var actionId in shortcuts) {
        var shortcut = shortcuts[actionId];

        if (!shortcut || !shortcut.key) {
          continue;
        }

        if (e.key === shortcut.key) {
          onShortcutActionDispatched(_objectSpread({}, shortcut.action, {
            selectedTool: actionId
          }));
        }
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return function () {
      window.removeEventListener("keypress", handleKeyPress);
      document.activeElement.blur();
    };
  }, [shortcuts]);
  return React.createElement(SidebarBoxContainer, {
    title: "Shortcuts"
  }, Object.keys(shortcuts).map(function (actionId, index) {
    if (!shortcuts[actionId]) return null;
    return React.createElement(ShortcutField, {
      key: actionId,
      actionId: actionId,
      actionName: shortcuts[actionId].name,
      keyName: shortcuts[actionId].key || "",
      onChangeShortcut: onChangeShortcut
    });
  }).filter(Boolean));
});