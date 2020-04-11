// @flow

import { useEffect } from "react"

import { useRafState, useInterval } from "react-use"

const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const isClient = typeof window !== "undefined"
  const [state, setState] = useRafState({
    width: isClient ? window.innerWidth : initialWidth,
    height: isClient ? window.innerHeight : initialHeight,
  })

  useEffect(() => {
    if (!isClient) return
    const handler = () => {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
    }
  }, [])

  useInterval(() => {
    if (!isClient) return
    if (
      window.innerWidth !== state.width ||
      window.innerHeight !== state.height
    ) {
      setState({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
  }, 100)

  return state
}

export default useWindowSize
