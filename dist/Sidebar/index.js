import React from "react";
import { styled } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TaskDescription from "../TaskDescriptionSidebarBox";
import ImageSelector from "../ImageSelectorSidebarBox";
import RegionSelector from "../RegionSelectorSidebarBox";
import History from "../HistorySidebarBox";
import DebugBox from "../DebugSidebarBox";
import TagsSidebarBox from "../TagsSidebarBox";
import KeyframesSelector from "../KeyframesSelectorSidebarBox";
var theme = createTheme();
var Container = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {};
});
var emptyArr = [];
export var Sidebar = function Sidebar(_ref2) {
  var debug = _ref2.debug,
      taskDescription = _ref2.taskDescription,
      keyframes = _ref2.keyframes,
      images = _ref2.images,
      regions = _ref2.regions,
      history = _ref2.history,
      labelImages = _ref2.labelImages,
      currentImage = _ref2.currentImage,
      currentVideoTime = _ref2.currentVideoTime,
      imageClsList = _ref2.imageClsList,
      imageTagList = _ref2.imageTagList,
      onChangeImage = _ref2.onChangeImage,
      onSelectRegion = _ref2.onSelectRegion,
      onSelectImage = _ref2.onSelectImage,
      onChangeRegion = _ref2.onChangeRegion,
      onDeleteRegion = _ref2.onDeleteRegion,
      _onRestoreHistory = _ref2.onRestoreHistory,
      onChangeVideoTime = _ref2.onChangeVideoTime,
      onDeleteKeyframe = _ref2.onDeleteKeyframe,
      onShortcutActionDispatched = _ref2.onShortcutActionDispatched;
  if (!regions) regions = emptyArr;
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(Container, null, debug && React.createElement(DebugBox, {
    state: debug,
    lastAction: debug.lastAction
  }), taskDescription && (taskDescription || "").length > 1 && React.createElement(TaskDescription, {
    description: taskDescription
  }), labelImages && React.createElement(TagsSidebarBox, {
    currentImage: currentImage,
    imageClsList: imageClsList,
    imageTagList: imageTagList,
    onChangeImage: onChangeImage,
    expandedByDefault: true
  }), React.createElement(RegionSelector, {
    regions: regions,
    onSelectRegion: onSelectRegion,
    onChangeRegion: onChangeRegion,
    onDeleteRegion: onDeleteRegion
  }), keyframes && React.createElement(KeyframesSelector, {
    currentVideoTime: currentVideoTime,
    keyframes: keyframes,
    onChangeVideoTime: onChangeVideoTime,
    onDeleteKeyframe: onDeleteKeyframe
  }), React.createElement(History, {
    history: history,
    onRestoreHistory: function onRestoreHistory() {
      return _onRestoreHistory();
    }
  })));
};
export default Sidebar;