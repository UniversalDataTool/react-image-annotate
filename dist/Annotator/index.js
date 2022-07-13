import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useEffect, useReducer } from "react";
import makeImmutable, { without } from "seamless-immutable";
import MainLayout from "../MainLayout";
import SettingsProvider from "../SettingsProvider";
import combineReducers from "./reducers/combine-reducers.js";
import generalReducer from "./reducers/general-reducer.js";
import getFromLocalStorage from "../utils/get-from-local-storage";
import historyHandler from "./reducers/history-handler.js";
import imageReducer from "./reducers/image-reducer.js";
import useEventCallback from "use-event-callback";
import videoReducer from "./reducers/video-reducer.js";
export var Annotator = function Annotator(_ref) {
  var images = _ref.images,
      allowedArea = _ref.allowedArea,
      _ref$selectedImage = _ref.selectedImage,
      selectedImage = _ref$selectedImage === void 0 ? images && images.length > 0 ? 0 : undefined : _ref$selectedImage,
      showPointDistances = _ref.showPointDistances,
      pointDistancePrecision = _ref.pointDistancePrecision,
      _ref$showTags = _ref.showTags,
      showTags = _ref$showTags === void 0 ? getFromLocalStorage("showTags", true) : _ref$showTags,
      _ref$enabledTools = _ref.enabledTools,
      enabledTools = _ref$enabledTools === void 0 ? ["select", "create-point", "create-box", "create-polygon", "create-line", "create-expanding-line", "show-mask"] : _ref$enabledTools,
      _ref$selectedTool = _ref.selectedTool,
      selectedTool = _ref$selectedTool === void 0 ? "select" : _ref$selectedTool,
      _ref$regionTagList = _ref.regionTagList,
      regionTagList = _ref$regionTagList === void 0 ? [] : _ref$regionTagList,
      _ref$regionClsList = _ref.regionClsList,
      regionClsList = _ref$regionClsList === void 0 ? [] : _ref$regionClsList,
      _ref$imageTagList = _ref.imageTagList,
      imageTagList = _ref$imageTagList === void 0 ? [] : _ref$imageTagList,
      _ref$imageClsList = _ref.imageClsList,
      imageClsList = _ref$imageClsList === void 0 ? [] : _ref$imageClsList,
      _ref$keyframes = _ref.keyframes,
      keyframes = _ref$keyframes === void 0 ? {} : _ref$keyframes,
      _ref$taskDescription = _ref.taskDescription,
      taskDescription = _ref$taskDescription === void 0 ? "" : _ref$taskDescription,
      _ref$fullImageSegment = _ref.fullImageSegmentationMode,
      fullImageSegmentationMode = _ref$fullImageSegment === void 0 ? false : _ref$fullImageSegment,
      RegionEditLabel = _ref.RegionEditLabel,
      videoSrc = _ref.videoSrc,
      _ref$videoTime = _ref.videoTime,
      videoTime = _ref$videoTime === void 0 ? 0 : _ref$videoTime,
      videoName = _ref.videoName,
      onExit = _ref.onExit,
      onNextImage = _ref.onNextImage,
      onPrevImage = _ref.onPrevImage,
      keypointDefinitions = _ref.keypointDefinitions,
      _ref$autoSegmentation = _ref.autoSegmentationOptions,
      autoSegmentationOptions = _ref$autoSegmentation === void 0 ? {
    type: "autoseg"
  } : _ref$autoSegmentation,
      hideHeader = _ref.hideHeader,
      hideHeaderText = _ref.hideHeaderText,
      hideNext = _ref.hideNext,
      hidePrev = _ref.hidePrev,
      hideClone = _ref.hideClone,
      hideSettings = _ref.hideSettings,
      hideFullScreen = _ref.hideFullScreen,
      hideSave = _ref.hideSave,
      allowComments = _ref.allowComments;

  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex(function (img) {
      return img.src === selectedImage;
    });
    if (selectedImage === -1) selectedImage = undefined;
  }

  var annotationType = images ? "image" : "video";

  var _useReducer = useReducer(historyHandler(combineReducers(annotationType === "image" ? imageReducer : videoReducer, generalReducer)), makeImmutable(_objectSpread({
    annotationType: annotationType,
    showTags: showTags,
    allowedArea: allowedArea,
    showPointDistances: showPointDistances,
    pointDistancePrecision: pointDistancePrecision,
    selectedTool: selectedTool,
    fullImageSegmentationMode: fullImageSegmentationMode,
    autoSegmentationOptions: autoSegmentationOptions,
    mode: null,
    taskDescription: taskDescription,
    showMask: true,
    labelImages: imageClsList.length > 0 || imageTagList.length > 0,
    regionClsList: regionClsList,
    regionTagList: regionTagList,
    imageClsList: imageClsList,
    imageTagList: imageTagList,
    currentVideoTime: videoTime,
    enabledTools: enabledTools,
    history: [],
    videoName: videoName,
    keypointDefinitions: keypointDefinitions,
    allowComments: allowComments
  }, annotationType === "image" ? {
    selectedImage: selectedImage,
    images: images,
    selectedImageFrameTime: images && images.length > 0 ? images[0].frameTime : undefined
  } : {
    videoSrc: videoSrc,
    keyframes: keyframes
  }))),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatchToReducer = _useReducer2[1];

  var dispatch = useEventCallback(function (action) {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"));
      } else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(without(state, "history"));
      } else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(without(state, "history"));
      }
    }

    dispatchToReducer(action);
  });
  var onRegionClassAdded = useEventCallback(function (cls) {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls
    });
  });
  useEffect(function () {
    if (selectedImage === undefined) return;
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage]
    });
  }, [selectedImage, state.images]);
  if (!images && !videoSrc) return 'Missing required prop "images" or "videoSrc"';
  return React.createElement(SettingsProvider, null, React.createElement(MainLayout, {
    RegionEditLabel: RegionEditLabel,
    alwaysShowNextButton: Boolean(onNextImage),
    alwaysShowPrevButton: Boolean(onPrevImage),
    state: state,
    dispatch: dispatch,
    onRegionClassAdded: onRegionClassAdded,
    hideHeader: hideHeader,
    hideHeaderText: hideHeaderText,
    hideNext: hideNext,
    hidePrev: hidePrev,
    hideClone: hideClone,
    hideSettings: hideSettings,
    hideFullScreen: hideFullScreen,
    hideSave: hideSave
  }));
};
export default Annotator;