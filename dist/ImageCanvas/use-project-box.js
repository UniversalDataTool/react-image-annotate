import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import useEventCallback from "use-event-callback";
import { getEnclosingBox } from "./region-tools.js";
export default (function (_ref) {
  var layoutParams = _ref.layoutParams,
      mat = _ref.mat;
  return useEventCallback(function (r) {
    var _layoutParams$current = layoutParams.current,
        iw = _layoutParams$current.iw,
        ih = _layoutParams$current.ih;
    var bbox = getEnclosingBox(r);
    var margin = r.type === "point" ? 15 : 2;
    var cbox = {
      x: bbox.x * iw - margin,
      y: bbox.y * ih - margin,
      w: bbox.w * iw + margin * 2,
      h: bbox.h * ih + margin * 2
    };

    var pbox = _objectSpread({}, mat.clone().inverse().applyToPoint(cbox.x, cbox.y), {
      w: cbox.w / mat.a,
      h: cbox.h / mat.d
    });

    return pbox;
  });
});