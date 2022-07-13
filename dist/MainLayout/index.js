import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import React, { useCallback, useRef } from "react";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import ClassSelectionMenu from "../ClassSelectionMenu";
import DebugBox from "../DebugSidebarBox";
import HistorySidebarBox from "../HistorySidebarBox";
import ImageCanvas from "../ImageCanvas";
import ImageSelector from "../ImageSelectorSidebarBox";
import KeyframeTimeline from "../KeyframeTimeline";
import KeyframesSelector from "../KeyframesSelectorSidebarBox";
import RegionSelector from "../RegionSelectorSidebarBox";
import SettingsDialog from "../SettingsDialog";
import TagsSidebarBox from "../TagsSidebarBox";
import TaskDescription from "../TaskDescriptionSidebarBox";
import Workspace from "react-material-workspace-layout/Workspace";
import classnames from "classnames";
import getActiveImage from "../Annotator/reducers/get-active-image";
import getHotkeyHelpText from "../utils/get-hotkey-help-text";
import iconDictionary from "./icon-dictionary";
import styles from "./styles";
import { useDispatchHotkeyHandlers } from "../ShortcutsManager";
import useEventCallback from "use-event-callback";
import useImpliedVideoRegions from "./use-implied-video-regions";
import useKey from "use-key-hook";
import { useSettings } from "../SettingsProvider";
import { withHotKeys } from "react-hotkeys"; // import Fullscreen from "../Fullscreen"

var emptyArr = [];
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return styles;
});
var HotkeyDiv = withHotKeys(function (_ref) {
  var hotKeys = _ref.hotKeys,
      children = _ref.children,
      divRef = _ref.divRef,
      props = _objectWithoutProperties(_ref, ["hotKeys", "children", "divRef"]);

  return React.createElement("div", Object.assign({}, _objectSpread({}, hotKeys, props), {
    ref: divRef
  }), children);
});
var FullScreenContainer = styled("div")(function (_ref2) {
  var theme = _ref2.theme;
  return {
    width: "100%",
    height: "100%",
    "& .fullscreen": {
      width: "100%",
      height: "100%"
    }
  };
});
export var MainLayout = function MainLayout(_ref3) {
  var state = _ref3.state,
      dispatch = _ref3.dispatch,
      _ref3$alwaysShowNextB = _ref3.alwaysShowNextButton,
      alwaysShowNextButton = _ref3$alwaysShowNextB === void 0 ? false : _ref3$alwaysShowNextB,
      _ref3$alwaysShowPrevB = _ref3.alwaysShowPrevButton,
      alwaysShowPrevButton = _ref3$alwaysShowPrevB === void 0 ? false : _ref3$alwaysShowPrevB,
      RegionEditLabel = _ref3.RegionEditLabel,
      onRegionClassAdded = _ref3.onRegionClassAdded,
      hideHeader = _ref3.hideHeader,
      hideHeaderText = _ref3.hideHeaderText,
      _ref3$hideNext = _ref3.hideNext,
      hideNext = _ref3$hideNext === void 0 ? false : _ref3$hideNext,
      _ref3$hidePrev = _ref3.hidePrev,
      hidePrev = _ref3$hidePrev === void 0 ? false : _ref3$hidePrev,
      _ref3$hideClone = _ref3.hideClone,
      hideClone = _ref3$hideClone === void 0 ? false : _ref3$hideClone,
      _ref3$hideSettings = _ref3.hideSettings,
      hideSettings = _ref3$hideSettings === void 0 ? false : _ref3$hideSettings,
      _ref3$hideFullScreen = _ref3.hideFullScreen,
      hideFullScreen = _ref3$hideFullScreen === void 0 ? false : _ref3$hideFullScreen,
      _ref3$hideSave = _ref3.hideSave,
      hideSave = _ref3$hideSave === void 0 ? false : _ref3$hideSave;
  var classes = useStyles();
  var settings = useSettings();
  var fullScreenHandle = useFullScreenHandle();
  var memoizedActionFns = useRef({});

  var action = function action(type) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var fnKey = "".concat(type, "(").concat(params.join(","), ")");
    if (memoizedActionFns.current[fnKey]) return memoizedActionFns.current[fnKey];

    var fn = function fn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return params.length > 0 ? dispatch(_objectSpread({
        type: type
      }, params.reduce(function (acc, p, i) {
        return acc[p] = args[i], acc;
      }, {}))) : dispatch(_objectSpread({
        type: type
      }, args[0]));
    };

    memoizedActionFns.current[fnKey] = fn;
    return fn;
  };

  var _getActiveImage = getActiveImage(state),
      currentImageIndex = _getActiveImage.currentImageIndex,
      activeImage = _getActiveImage.activeImage;

  var nextImage;

  if (currentImageIndex !== null) {
    nextImage = state.images[currentImageIndex + 1];
  }

  useKey(function () {
    return dispatch({
      type: "CANCEL"
    });
  }, {
    detectKeys: [27]
  });
  var isAVideoFrame = activeImage && activeImage.frameTime !== undefined;
  var innerContainerRef = useRef();
  var hotkeyHandlers = useDispatchHotkeyHandlers({
    dispatch: dispatch
  });
  var impliedVideoRegions = useImpliedVideoRegions(state);
  var refocusOnMouseEvent = useCallback(function (e) {
    if (!innerContainerRef.current) return;
    if (innerContainerRef.current.contains(document.activeElement)) return;

    if (innerContainerRef.current.contains(e.target)) {
      innerContainerRef.current.focus();
      e.target.focus();
    }
  }, []);
  var canvas = React.createElement(ImageCanvas, Object.assign({}, settings, {
    showCrosshairs: settings.showCrosshairs && !["select", "pan", "zoom"].includes(state.selectedTool),
    key: state.selectedImage,
    showMask: state.showMask,
    fullImageSegmentationMode: state.fullImageSegmentationMode,
    autoSegmentationOptions: state.autoSegmentationOptions,
    showTags: state.showTags,
    allowedArea: state.allowedArea,
    modifyingAllowedArea: state.selectedTool === "modify-allowed-area",
    regionClsList: state.regionClsList,
    regionTagList: state.regionTagList,
    regions: state.annotationType === "image" ? activeImage.regions || [] : impliedVideoRegions,
    realSize: activeImage ? activeImage.realSize : undefined,
    videoPlaying: state.videoPlaying,
    imageSrc: state.annotationType === "image" ? activeImage.src : null,
    videoSrc: state.annotationType === "video" ? state.videoSrc : null,
    pointDistancePrecision: state.pointDistancePrecision,
    createWithPrimary: state.selectedTool.includes("create"),
    dragWithPrimary: state.selectedTool === "pan",
    zoomWithPrimary: state.selectedTool === "zoom",
    showPointDistances: state.showPointDistances,
    videoTime: state.annotationType === "image" ? state.selectedImageFrameTime : state.currentVideoTime,
    keypointDefinitions: state.keypointDefinitions,
    onMouseMove: action("MOUSE_MOVE"),
    onMouseDown: action("MOUSE_DOWN"),
    onMouseUp: action("MOUSE_UP"),
    onChangeRegion: action("CHANGE_REGION", "region"),
    onBeginRegionEdit: action("OPEN_REGION_EDITOR", "region"),
    onCloseRegionEdit: action("CLOSE_REGION_EDITOR", "region"),
    onDeleteRegion: action("DELETE_REGION", "region"),
    onBeginBoxTransform: action("BEGIN_BOX_TRANSFORM", "box", "directions"),
    onBeginMovePolygonPoint: action("BEGIN_MOVE_POLYGON_POINT", "polygon", "pointIndex"),
    onBeginMoveKeypoint: action("BEGIN_MOVE_KEYPOINT", "region", "keypointId"),
    onAddPolygonPoint: action("ADD_POLYGON_POINT", "polygon", "point", "pointIndex"),
    onSelectRegion: action("SELECT_REGION", "region"),
    onBeginMovePoint: action("BEGIN_MOVE_POINT", "point"),
    onImageLoaded: action("IMAGE_LOADED", "image"),
    RegionEditLabel: RegionEditLabel,
    onImageOrVideoLoaded: action("IMAGE_OR_VIDEO_LOADED", "metadata"),
    onChangeVideoTime: action("CHANGE_VIDEO_TIME", "newTime"),
    onChangeVideoPlaying: action("CHANGE_VIDEO_PLAYING", "isPlaying"),
    onRegionClassAdded: onRegionClassAdded,
    allowComments: state.allowComments
  }));
  var onClickIconSidebarItem = useEventCallback(function (item) {
    dispatch({
      type: "SELECT_TOOL",
      selectedTool: item.name
    });
  });
  var onClickHeaderItem = useEventCallback(function (item) {
    if (item.name === "Fullscreen") {
      fullScreenHandle.enter();
    } else if (item.name === "Window") {
      fullScreenHandle.exit();
    }

    dispatch({
      type: "HEADER_BUTTON_CLICKED",
      buttonName: item.name
    });
  });
  var debugModeOn = Boolean(window.localStorage.$ANNOTATE_DEBUG_MODE && state);
  var nextImageHasRegions = !nextImage || nextImage.regions && nextImage.regions.length > 0;
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(FullScreenContainer, null, React.createElement(FullScreen, {
    handle: fullScreenHandle,
    onChange: function onChange(open) {
      if (!open) {
        fullScreenHandle.exit();
        action("HEADER_BUTTON_CLICKED", "buttonName")("Window");
      }
    }
  }, React.createElement(HotkeyDiv, {
    tabIndex: -1,
    divRef: innerContainerRef,
    onMouseDown: refocusOnMouseEvent,
    onMouseOver: refocusOnMouseEvent,
    allowChanges: true,
    handlers: hotkeyHandlers,
    className: classnames(classes.container, state.fullScreen && "Fullscreen")
  }, React.createElement(Workspace, {
    allowFullscreen: true,
    iconDictionary: iconDictionary,
    hideHeader: hideHeader,
    hideHeaderText: hideHeaderText,
    headerLeftSide: [state.annotationType === "video" ? React.createElement(KeyframeTimeline, {
      currentTime: state.currentVideoTime,
      duration: state.videoDuration,
      onChangeCurrentTime: action("CHANGE_VIDEO_TIME", "newTime"),
      keyframes: state.keyframes
    }) : activeImage ? React.createElement("div", {
      className: classes.headerTitle
    }, activeImage.name) : null].filter(Boolean),
    headerItems: [!hidePrev && {
      name: "Prev"
    }, !hideNext && {
      name: "Next"
    }, state.annotationType !== "video" ? null : !state.videoPlaying ? {
      name: "Play"
    } : {
      name: "Pause"
    }, !hideClone && !nextImageHasRegions && activeImage.regions && {
      name: "Clone"
    }, !hideSettings && {
      name: "Settings"
    }, // !hideFullScreen &&
    //   (state.fullScreen
    //     ? { name: "Window" }
    //     : { name: "Fullscreen" }),
    !hideSave && {
      name: "Save"
    }].filter(Boolean),
    onClickHeaderItem: onClickHeaderItem,
    onClickIconSidebarItem: onClickIconSidebarItem,
    selectedTools: [state.selectedTool, state.showTags && "show-tags", state.showMask && "show-mask"].filter(Boolean),
    iconSidebarItems: [{
      name: "select",
      helperText: "Select" + getHotkeyHelpText("select_tool"),
      alwaysShowing: true
    }, {
      name: "pan",
      helperText: "Drag/Pan (right or middle click)" + getHotkeyHelpText("pan_tool"),
      alwaysShowing: true
    }, {
      name: "zoom",
      helperText: "Zoom In/Out (scroll)" + getHotkeyHelpText("zoom_tool"),
      alwaysShowing: true
    }, {
      name: "show-tags",
      helperText: "Show / Hide Tags",
      alwaysShowing: true
    }, {
      name: "create-point",
      helperText: "Add Point" + getHotkeyHelpText("create_point")
    }, {
      name: "create-box",
      helperText: "Add Bounding Box" + getHotkeyHelpText("create_bounding_box")
    }, {
      name: "create-polygon",
      helperText: "Add Polygon" + getHotkeyHelpText("create_polygon")
    }, {
      name: "create-line",
      helperText: "Add Line"
    }, {
      name: "create-expanding-line",
      helperText: "Add Expanding Line"
    }, {
      name: "create-keypoints",
      helperText: "Add Keypoints (Pose)"
    }, state.fullImageSegmentationMode && {
      name: "show-mask",
      alwaysShowing: true,
      helperText: "Show / Hide Mask"
    }, {
      name: "modify-allowed-area",
      helperText: "Modify Allowed Area"
    }].filter(Boolean).filter(function (a) {
      return a.alwaysShowing || state.enabledTools.includes(a.name);
    }),
    rightSidebarItems: [debugModeOn && React.createElement(DebugBox, {
      state: debugModeOn,
      lastAction: state.lastAction
    }), state.taskDescription && React.createElement(TaskDescription, {
      description: state.taskDescription
    }), state.regionClsList && React.createElement(ClassSelectionMenu, {
      selectedCls: state.selectedCls,
      regionClsList: state.regionClsList,
      onSelectCls: action("SELECT_CLASSIFICATION", "cls")
    }), state.labelImages && React.createElement(TagsSidebarBox, {
      currentImage: activeImage,
      imageClsList: state.imageClsList,
      imageTagList: state.imageTagList,
      onChangeImage: action("CHANGE_IMAGE", "delta"),
      expandedByDefault: true
    }), // (state.images?.length || 0) > 1 && (
    //   <ImageSelector
    //     onSelect={action("SELECT_REGION", "region")}
    //     images={state.images}
    //   />
    // ),
    React.createElement(RegionSelector, {
      regions: activeImage ? activeImage.regions : emptyArr,
      onSelectRegion: action("SELECT_REGION", "region"),
      onDeleteRegion: action("DELETE_REGION", "region"),
      onChangeRegion: action("CHANGE_REGION", "region")
    }), state.keyframes && React.createElement(KeyframesSelector, {
      onChangeVideoTime: action("CHANGE_VIDEO_TIME", "newTime"),
      onDeleteKeyframe: action("DELETE_KEYFRAME", "time"),
      onChangeCurrentTime: action("CHANGE_VIDEO_TIME", "newTime"),
      currentTime: state.currentVideoTime,
      duration: state.videoDuration,
      keyframes: state.keyframes
    }), React.createElement(HistorySidebarBox, {
      history: state.history,
      onRestoreHistory: action("RESTORE_HISTORY")
    })].filter(Boolean)
  }, canvas), React.createElement(SettingsDialog, {
    open: state.settingsOpen,
    onClose: function onClose() {
      return dispatch({
        type: "HEADER_BUTTON_CLICKED",
        buttonName: "Settings"
      });
    }
  })))));
};
export default MainLayout;