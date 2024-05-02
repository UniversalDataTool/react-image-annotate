// @flow

import { useCallback, useLayoutEffect, useRef } from "react";

export default (fn: Function) => {
  let ref = useRef<Function>();

  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: any) => {
    // @ts-ignore
    return (0, ref.current!)(...args);
  }, []);
};
