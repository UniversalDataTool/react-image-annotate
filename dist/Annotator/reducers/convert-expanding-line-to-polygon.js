import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}

export default (function (expandingLine) {
  var expandingWidth = expandingLine.expandingWidth || 0.005;
  var pointPairs = expandingLine.points.map(function (_ref, i) {
    var x = _ref.x,
        y = _ref.y,
        angle = _ref.angle,
        width = _ref.width;

    if (!angle) {
      var n = expandingLine.points[clamp(i + 1, 0, expandingLine.points.length - 1)];
      var p = expandingLine.points[clamp(i - 1, 0, expandingLine.points.length - 1)];
      angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2;
    }

    var dx = Math.sin(angle) * (width || expandingWidth) / 2;
    var dy = Math.cos(angle) * (width || expandingWidth) / 2;
    return [{
      x: x + dx,
      y: y + dy
    }, {
      x: x - dx,
      y: y - dy
    }];
  });
  var firstSection = pointPairs.map(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        p1 = _ref3[0],
        p2 = _ref3[1];

    return p1;
  });
  var secondSection = pointPairs.map(function (_ref4) {
    var _ref5 = _slicedToArray(_ref4, 2),
        p1 = _ref5[0],
        p2 = _ref5[1];

    return p2;
  }).asMutable();
  secondSection.reverse();
  var newPoints = firstSection.concat(secondSection).map(function (_ref6) {
    var x = _ref6.x,
        y = _ref6.y;
    return [x, y];
  });
  return _objectSpread({}, expandingLine, {
    type: "polygon",
    open: false,
    points: newPoints,
    unfinished: undefined,
    candidatePoint: undefined // let { expandingWidth = 0.005, points } = region
    // expandingWidth = points.slice(-1)[0].width || expandingWidth
    // const lastPoint = points.slice(-1)[0]
    // return (
    //   <>
    //     <polygon
    //       points={
    //         .map((p) => `${p.x * iw} ${p.y * ih}`)
    //         .join(" ")}
    // return {
    //   ...expandingLine,
    //   unfinished: undefined,
    //   candidatePoint: undefined,
    // }

  });
});