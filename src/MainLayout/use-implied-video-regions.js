// @flow

import type { MainLayoutVideoAnnotationState } from "../Annotator/types"

const emptyArr = []

export default (state: MainLayoutVideoAnnotationState) => {
  if (state.annotationType !== "video") return emptyArr
  const { keyframes, currentVideoTime = 0 } = state
  if (keyframes[currentVideoTime || 0]) {
    return keyframes[currentVideoTime || 0].regions
  }
  // Get surrounding video keyframes
  const keyframeTimes = Object.keys(keyframes)
    .map(a => parseInt(a))
    .filter(a => !isNaN(a))
  if (keyframeTimes.length === 0) return emptyArr
  keyframeTimes.sort((a, b) => a - b)
  let nextKeyframeTimeIndex = keyframeTimes.findIndex(
    kt => kt >= currentVideoTime
  )
  if (nextKeyframeTimeIndex === -1) {
    return (
      keyframes[keyframeTimes[keyframeTimes.length - 1]].regions || emptyArr
    )
  }

  const t1 = keyframeTimes[nextKeyframeTimeIndex - 1]
  const prevKeyframe = keyframes[t1]
  const t2 = keyframeTimes[nextKeyframeTimeIndex]
  const nextKeyframe = keyframes[t2]

  const [prevRegionMap, nextRegionMap] = [{}, {}]
  for (const region of prevKeyframe.regions) prevRegionMap[region.id] = region
  for (const region of nextKeyframe.regions) nextRegionMap[region.id] = region

  console.log({ prevRegionMap, nextRegionMap, keyframes, t2 })

  const impliedRegions = []

  // Weighted time coefficients for linear transition
  const w1 = (t2 - state.currentVideoTime) / (t2 - t1)
  const w2 = 1 - w1

  for (const regionId in prevRegionMap) {
    const [prev, next] = [prevRegionMap[regionId], nextRegionMap[regionId]]
    console.log({ regionId, prev, next })
    switch (prev.type) {
      case "point": {
        impliedRegions.push({
          ...prev,
          x: prev.x * w1 + next.x * w2,
          y: prev.y * w1 + next.y * w2
        })
      }
    }
  }

  return impliedRegions
}
