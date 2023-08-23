// @flow

import { useCallback, useLayoutEffect, useRef } from "react"

export default (fn) => {
  let ref = useRef()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args) => (0, ref.current)(...args), [])
}
