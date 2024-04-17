import { useMemo } from "react"
import getImpliedVideoRegions from "../Annotator/reducers/get-implied-video-regions.js"

const emptyArr = []

export default (state) => {
  if (state.annotationType !== "video") return emptyArr
  const { keyframes, currentVideoTime = 0 } = state
  // TODO memoize
  return useMemo(
    () => getImpliedVideoRegions(keyframes, currentVideoTime),
    [keyframes, currentVideoTime]
  )
}
