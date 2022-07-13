import { getApplicationKeyMap } from "react-hotkeys";
export var getHotkeyHelpText = function getHotkeyHelpText(commandName) {
  var _getApplicationKeyMap, _getApplicationKeyMap2, _getApplicationKeyMap3;

  var firstSequence = (_getApplicationKeyMap = getApplicationKeyMap()[commandName]) === null || _getApplicationKeyMap === void 0 ? void 0 : (_getApplicationKeyMap2 = _getApplicationKeyMap.sequences) === null || _getApplicationKeyMap2 === void 0 ? void 0 : (_getApplicationKeyMap3 = _getApplicationKeyMap2[0]) === null || _getApplicationKeyMap3 === void 0 ? void 0 : _getApplicationKeyMap3.sequence;
  if (!firstSequence) return "";
  return " (".concat(firstSequence, ")");
};
export default getHotkeyHelpText;