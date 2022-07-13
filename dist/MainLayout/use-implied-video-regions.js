import { useMemo } from "react";
import getImpliedVideoRegions from "../Annotator/reducers/get-implied-video-regions.js";
var emptyArr = [];
export default (function (state) {
  if (state.annotationType !== "video") return emptyArr;
  var keyframes = state.keyframes,
      _state$currentVideoTi = state.currentVideoTime,
      currentVideoTime = _state$currentVideoTi === void 0 ? 0 : _state$currentVideoTi; // TODO memoize

  return useMemo(function () {
    return getImpliedVideoRegions(keyframes, currentVideoTime);
  }, [keyframes, currentVideoTime]);
});