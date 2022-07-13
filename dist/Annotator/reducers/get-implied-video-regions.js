import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
var emptyArr = [];
export default (function (keyframes, time) {
  if (keyframes[time || 0]) {
    return keyframes[time || 0].regions;
  } // Get surrounding video keyframes


  var keyframeTimes = Object.keys(keyframes).map(function (a) {
    return parseInt(a);
  }).filter(function (a) {
    return !isNaN(a);
  });
  if (keyframeTimes.length === 0) return emptyArr;
  keyframeTimes.sort(function (a, b) {
    return a - b;
  });
  var nextKeyframeTimeIndex = keyframeTimes.findIndex(function (kt) {
    return kt >= time;
  });

  if (nextKeyframeTimeIndex === -1) {
    return keyframes[keyframeTimes[keyframeTimes.length - 1]].regions || emptyArr;
  } else if (nextKeyframeTimeIndex === 0) {
    return emptyArr;
  }

  var t1 = keyframeTimes[nextKeyframeTimeIndex - 1];
  var prevKeyframe = keyframes[t1];
  var t2 = keyframeTimes[nextKeyframeTimeIndex];
  var nextKeyframe = keyframes[t2];
  var prevRegionMap = {},
      nextRegionMap = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = prevKeyframe.regions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var region = _step.value;
      prevRegionMap[region.id] = region;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = nextKeyframe.regions[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var _region = _step2.value;
      nextRegionMap[_region.id] = _region;
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var impliedRegions = []; // Weighted time coefficients for linear transition

  var w1 = (t2 - time) / (t2 - t1);
  var w2 = 1 - w1;

  var _loop = function _loop(regionId) {
    var _ref = [prevRegionMap[regionId], nextRegionMap[regionId]],
        prev = _ref[0],
        next = _ref[1];

    if (!next) {
      impliedRegions.push(_objectSpread({}, prev, {
        highlighted: false,
        editingLabels: false
      }));
      return "continue";
    }

    switch (prev.type) {
      case "point":
        {
          impliedRegions.push(_objectSpread({}, prev, {
            highlighted: false,
            editingLabels: false,
            x: prev.x * w1 + next.x * w2,
            y: prev.y * w1 + next.y * w2
          }));
          break;
        }

      case "box":
        {
          impliedRegions.push(_objectSpread({}, prev, {
            highlighted: false,
            editingLabels: false,
            x: prev.x * w1 + next.x * w2,
            y: prev.y * w1 + next.y * w2,
            w: prev.w * w1 + next.w * w2,
            h: prev.h * w1 + next.h * w2
          }));
          break;
        }

      case "polygon":
        {
          if (next.points.length === prev.points.length) {
            impliedRegions.push(_objectSpread({}, prev, {
              highlighted: false,
              editingLabels: false,
              points: prev.points.map(function (pp, i) {
                return [pp[0] * w1 + next.points[i][0] * w2, pp[1] * w1 + next.points[i][1] * w2];
              })
            }));
          } else {
            impliedRegions.push(prev);
          }

          break;
        }

      case "keypoints":
        {
          var newPoints = {};

          for (var _i = 0, _Object$entries = Object.entries(prev.points); _i < _Object$entries.length; _i++) {
            var _ref4 = _Object$entries[_i];

            var _ref3 = _slicedToArray(_ref4, 2);

            var pointId = _ref3[0];
            var prevPoint = _ref3[1];
            newPoints[pointId] = {
              x: prevPoint.x * w1 + next.points[pointId].x * w2,
              y: prevPoint.y * w1 + next.points[pointId].y * w2
            };
          }

          impliedRegions.push(_objectSpread({}, prev, {
            highlighted: false,
            editingLabels: false,
            points: newPoints
          }));
          break;
        }

      default:
        break;
    }
  };

  for (var regionId in prevRegionMap) {
    var _ret = _loop(regionId);

    if (_ret === "continue") continue;
  }

  return impliedRegions;
});