import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, memo } from "react";
import HighlightBox from "../HighlightBox";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PreventScrollToParents from "../PreventScrollToParents";
import Tooltip from "@mui/material/Tooltip";
var theme = createTheme();
var TransformGrabber = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    width: 8,
    height: 8,
    zIndex: 2,
    border: "2px solid #FFF",
    position: "absolute"
  };
});
var boxCursorMap = [["nw-resize", "n-resize", "ne-resize"], ["w-resize", "grab", "e-resize"], ["sw-resize", "s-resize", "se-resize"]];

var arePropsEqual = function arePropsEqual(prev, next) {
  return prev.region === next.region && prev.dragWithPrimary === next.dragWithPrimary && prev.createWithPrimary === next.createWithPrimary && prev.zoomWithPrimary === next.zoomWithPrimary && prev.mat === next.mat;
};

export var RegionSelectAndTransformBox = memo(function (_ref2) {
  var r = _ref2.region,
      mouseEvents = _ref2.mouseEvents,
      projectRegionBox = _ref2.projectRegionBox,
      dragWithPrimary = _ref2.dragWithPrimary,
      createWithPrimary = _ref2.createWithPrimary,
      zoomWithPrimary = _ref2.zoomWithPrimary,
      onBeginMovePoint = _ref2.onBeginMovePoint,
      onSelectRegion = _ref2.onSelectRegion,
      layoutParams = _ref2.layoutParams,
      _ref2$fullImageSegmen = _ref2.fullImageSegmentationMode,
      fullImageSegmentationMode = _ref2$fullImageSegmen === void 0 ? false : _ref2$fullImageSegmen,
      mat = _ref2.mat,
      onBeginBoxTransform = _ref2.onBeginBoxTransform,
      onBeginMovePolygonPoint = _ref2.onBeginMovePolygonPoint,
      onBeginMoveKeypoint = _ref2.onBeginMoveKeypoint,
      onAddPolygonPoint = _ref2.onAddPolygonPoint,
      showHighlightBox = _ref2.showHighlightBox;
  var pbox = projectRegionBox(r);
  var _layoutParams$current = layoutParams.current,
      iw = _layoutParams$current.iw,
      ih = _layoutParams$current.ih;
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(Fragment, null, React.createElement(PreventScrollToParents, null, showHighlightBox && r.type !== "polygon" && React.createElement(HighlightBox, {
    region: r,
    mouseEvents: mouseEvents,
    dragWithPrimary: dragWithPrimary,
    createWithPrimary: createWithPrimary,
    zoomWithPrimary: zoomWithPrimary,
    onBeginMovePoint: onBeginMovePoint,
    onSelectRegion: onSelectRegion,
    pbox: pbox
  }), r.type === "box" && !dragWithPrimary && !zoomWithPrimary && !r.locked && r.highlighted && mat.a < 1.2 && [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5], [0.5, 0.5]].map(function (_ref3, i) {
    var _ref4 = _slicedToArray(_ref3, 2),
        px = _ref4[0],
        py = _ref4[1];

    return React.createElement(TransformGrabber, Object.assign({
      key: i
    }, mouseEvents, {
      onMouseDown: function onMouseDown(e) {
        if (e.button === 0) return onBeginBoxTransform(r, [px * 2 - 1, py * 2 - 1]);
        mouseEvents.onMouseDown(e);
      },
      style: {
        left: pbox.x - 4 - 2 + pbox.w * px,
        top: pbox.y - 4 - 2 + pbox.h * py,
        cursor: boxCursorMap[py * 2][px * 2],
        borderRadius: px === 0.5 && py === 0.5 ? 4 : undefined
      }
    }));
  }), r.type === "polygon" && !dragWithPrimary && !zoomWithPrimary && !r.locked && r.highlighted && r.points.map(function (_ref5, i) {
    var _ref6 = _slicedToArray(_ref5, 2),
        px = _ref6[0],
        py = _ref6[1];

    var proj = mat.clone().inverse().applyToPoint(px * iw, py * ih);
    return React.createElement(TransformGrabber, Object.assign({
      key: i
    }, mouseEvents, {
      onMouseDown: function onMouseDown(e) {
        if (e.button === 0 && (!r.open || i === 0)) return onBeginMovePolygonPoint(r, i);
        mouseEvents.onMouseDown(e);
      },
      style: {
        cursor: !r.open ? "move" : i === 0 ? "pointer" : undefined,
        zIndex: 10,
        pointerEvents: r.open && i === r.points.length - 1 ? "none" : undefined,
        left: proj.x - 4,
        top: proj.y - 4
      }
    }));
  }), r.type === "polygon" && r.highlighted && !dragWithPrimary && !zoomWithPrimary && !r.locked && !r.open && r.points.length > 1 && r.points.map(function (p1, i) {
    return [p1, r.points[(i + 1) % r.points.length]];
  }).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        p1 = _ref8[0],
        p2 = _ref8[1];

    return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
  }).map(function (pa, i) {
    var proj = mat.clone().inverse().applyToPoint(pa[0] * iw, pa[1] * ih);
    return React.createElement(TransformGrabber, Object.assign({
      key: i
    }, mouseEvents, {
      onMouseDown: function onMouseDown(e) {
        if (e.button === 0) return onAddPolygonPoint(r, pa, i + 1);
        mouseEvents.onMouseDown(e);
      },
      style: {
        cursor: "copy",
        zIndex: 10,
        left: proj.x - 4,
        top: proj.y - 4,
        border: "2px dotted #fff",
        opacity: 0.5
      }
    }));
  }), r.type === "keypoints" && !dragWithPrimary && !zoomWithPrimary && !r.locked && r.highlighted && Object.entries(r.points).map(function (_ref9, i) {
    var _ref10 = _slicedToArray(_ref9, 2),
        keypointId = _ref10[0],
        _ref10$ = _ref10[1],
        px = _ref10$.x,
        py = _ref10$.y;

    var proj = mat.clone().inverse().applyToPoint(px * iw, py * ih);
    return React.createElement(Tooltip, {
      title: keypointId,
      key: i
    }, React.createElement(TransformGrabber, Object.assign({
      key: i
    }, mouseEvents, {
      onMouseDown: function onMouseDown(e) {
        if (e.button === 0 && (!r.open || i === 0)) return onBeginMoveKeypoint(r, keypointId);
        mouseEvents.onMouseDown(e);
      },
      style: {
        cursor: !r.open ? "move" : i === 0 ? "pointer" : undefined,
        zIndex: 10,
        pointerEvents: r.open && i === r.points.length - 1 ? "none" : undefined,
        left: proj.x - 4,
        top: proj.y - 4
      }
    })));
  }))));
}, arePropsEqual);
export var RegionSelectAndTransformBoxes = memo(function (props) {
  return props.regions.filter(function (r) {
    return r.visible || r.visible === undefined;
  }).filter(function (r) {
    return !r.locked;
  }).map(function (r, i) {
    return React.createElement(RegionSelectAndTransformBox, Object.assign({
      key: r.id
    }, props, {
      region: r
    }));
  });
}, function (n, p) {
  return n.regions === p.regions && n.mat === p.mat;
});
export default RegionSelectAndTransformBoxes;