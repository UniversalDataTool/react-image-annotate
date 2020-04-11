// @flow

import { useRef, useCallback, useLayoutEffect, useEffect } from "react"

export default (fn) => {
  let ref = useRef()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args) => (0, ref.current)(...args), [])
}
