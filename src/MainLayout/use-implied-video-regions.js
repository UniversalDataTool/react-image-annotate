// @flow

import { useMemo } from "react"
import type { MainLayoutVideoAnnotationState } from "../Annotator/types"
import getImpliedVideoRegions from "../Annotator/reducers/get-implied-video-regions.js"

const emptyArr = []

export default (state: MainLayoutVideoAnnotationState) => {
  if (state.annotationType !== "video") return emptyArr
  const { keyframes, currentVideoTime = 0 } = state
  // TODO memoize
  return useMemo(
    () => getImpliedVideoRegions(keyframes, currentVideoTime),
    [keyframes, currentVideoTime]
  )
}
