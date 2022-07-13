import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { useEffect } from "react";
import { useSettings } from "../SettingsProvider";
export default (function (_ref) {
  var getLatestMat = _ref.getLatestMat,
      changeMat = _ref.changeMat;

  var _useSettings = useSettings(),
      wasdMode = _useSettings.wasdMode;

  useEffect(function () {
    if (!wasdMode) return;
    var vel = 10;
    var dirs = {
      w: [0, -vel],
      a: [-vel, 0],
      s: [0, vel],
      d: [vel, 0]
    };
    var keysDown = {};
    var keys = Object.keys(dirs);

    var keyDownListener = function keyDownListener(e) {
      if (keys.includes(e.key)) {
        keysDown[e.key] = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    var keyUpListener = function keyUpListener(e) {
      if (keys.includes(e.key)) {
        keysDown[e.key] = false;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    var interval = setInterval(function () {
      var newMat = getLatestMat().clone();
      var somethingChanged = false;

      for (var key in keysDown) {
        if (keysDown[key]) {
          var _newMat;

          newMat = (_newMat = newMat).translate.apply(_newMat, _toConsumableArray(dirs[key]));
          somethingChanged = true;
        }
      }

      if (somethingChanged) changeMat(newMat);
    }, 16);
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);
    return function () {
      clearInterval(interval);
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
    };
  }, [wasdMode]);
});