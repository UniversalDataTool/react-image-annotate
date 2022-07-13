import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useEffect } from "react";
import { useRafState, useInterval } from "react-use";

var useWindowSize = function useWindowSize() {
  var initialWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Infinity;
  var initialHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Infinity;
  var isClient = typeof window !== "undefined";

  var _useRafState = useRafState({
    width: isClient ? window.innerWidth : initialWidth,
    height: isClient ? window.innerHeight : initialHeight
  }),
      _useRafState2 = _slicedToArray(_useRafState, 2),
      state = _useRafState2[0],
      setState = _useRafState2[1];

  useEffect(function () {
    if (!isClient) return;

    var handler = function handler() {
      setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener("resize", handler);
    return function () {
      window.removeEventListener("resize", handler);
    };
  }, []);
  useInterval(function () {
    if (!isClient) return;

    if (window.innerWidth !== state.width || window.innerHeight !== state.height) {
      setState({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  }, 100);
  return state;
};

export default useWindowSize;