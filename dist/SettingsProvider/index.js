import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { createContext, useContext, useState } from "react";
var defaultSettings = {
  showCrosshairs: false,
  showHighlightBox: true,
  wasdMode: true
};
export var SettingsContext = createContext(defaultSettings);

var pullSettingsFromLocalStorage = function pullSettingsFromLocalStorage() {
  if (!window || !window.localStorage) return {};
  var settings = {};

  for (var i = 0; i < window.localStorage.length; i++) {
    var key = window.localStorage.key(i);

    if (key.startsWith("settings_")) {
      try {
        settings[key.replace("settings_", "")] = JSON.parse(window.localStorage.getItem(key));
      } catch (e) {}
    }
  }

  return settings;
};

export var useSettings = function useSettings() {
  return useContext(SettingsContext);
};
export var SettingsProvider = function SettingsProvider(_ref) {
  var children = _ref.children;

  var _useState = useState(function () {
    return pullSettingsFromLocalStorage();
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      changeState = _useState2[1];

  var changeSetting = function changeSetting(setting, value) {
    changeState(_objectSpread({}, state, _defineProperty({}, setting, value)));
    window.localStorage.setItem("settings_".concat(setting), JSON.stringify(value));
  };

  return React.createElement(SettingsContext.Provider, {
    value: _objectSpread({}, state, {
      changeSetting: changeSetting
    })
  }, children);
};
export default SettingsProvider;