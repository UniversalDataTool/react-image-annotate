import { useRef, useCallback, useLayoutEffect, useEffect } from "react";
export default (function (fn) {
  var ref = useRef();
  useLayoutEffect(function () {
    ref.current = fn;
  });
  return useCallback(function () {
    return (0, ref.current).apply(void 0, arguments);
  }, []);
});