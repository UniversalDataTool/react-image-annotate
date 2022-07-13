import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export default (function (_ref) {
  var center = _ref.center,
      scale = _ref.scale,
      landmarks = _ref.landmarks;
  var points = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.entries(landmarks)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref4 = _step.value;

      var _ref3 = _slicedToArray(_ref4, 2);

      var keypointId = _ref3[0];
      var defaultPosition = _ref3[1].defaultPosition;
      points[keypointId] = {
        x: defaultPosition[0] * scale + center.x,
        y: defaultPosition[1] * scale + center.y
      };
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

  return points;
});