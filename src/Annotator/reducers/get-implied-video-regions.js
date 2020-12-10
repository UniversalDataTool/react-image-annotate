// @flow

import type { Region } from "../../ImageCanvas/region-tools.js"

const emptyArr = []

export default (
  keyframes: { [string | number]: { regions: Array<Region> } },
  time: number
) => {
  if (keyframes[time || 0]) {
    return keyframes[time || 0].regions
  }
  // Get surrounding video keyframes
  const keyframeTimes = Object.keys(keyframes)
    .map((a) => parseInt(a))
    .filter((a) => !isNaN(a))
  if (keyframeTimes.length === 0) return emptyArr
  keyframeTimes.sort((a, b) => a - b)
  let nextKeyframeTimeIndex = keyframeTimes.findIndex((kt) => kt >= time)
  if (nextKeyframeTimeIndex === -1) {
    return (
      keyframes[keyframeTimes[keyframeTimes.length - 1]].regions || emptyArr
    )
  } else if (nextKeyframeTimeIndex === 0) {
    return emptyArr
  }

  const t1 = keyframeTimes[nextKeyframeTimeIndex - 1]
  const prevKeyframe = keyframes[t1]
  const t2 = keyframeTimes[nextKeyframeTimeIndex]
  const nextKeyframe = keyframes[t2]

  const [prevRegionMap, nextRegionMap] = [{}, {}]
  for (const region of prevKeyframe.regions) prevRegionMap[region.id] = region
  for (const region of nextKeyframe.regions) nextRegionMap[region.id] = region

  const impliedRegions = []

  // Weighted time coefficients for linear transition
  const w1 = (t2 - time) / (t2 - t1)
  const w2 = 1 - w1

  for (const regionId in prevRegionMap) {
    const [prev, next] = [prevRegionMap[regionId], nextRegionMap[regionId]]
    if (!next) {
      impliedRegions.push({
        ...prev,
        highlighted: false,
        editingLabels: false,
      })
      continue
    }
    switch (prev.type) {
      case "point": {
        impliedRegions.push({
          ...prev,
          highlighted: false,
          editingLabels: false,
          x: prev.x * w1 + next.x * w2,
          y: prev.y * w1 + next.y * w2,
        })
        break
      }
      case "box": {
        impliedRegions.push({
          ...prev,
          highlighted: false,
          editingLabels: false,
          x: prev.x * w1 + next.x * w2,
          y: prev.y * w1 + next.y * w2,
          w: prev.w * w1 + next.w * w2,
          h: prev.h * w1 + next.h * w2,
        })
        break
      }
      case "polygon": {
        if (next.points.length === prev.points.length) {
          impliedRegions.push({
            ...prev,
            highlighted: false,
            editingLabels: false,
            points: prev.points.map((pp, i) => [
              pp[0] * w1 + next.points[i][0] * w2,
              pp[1] * w1 + next.points[i][1] * w2,
            ]),
          })
        } else {
          impliedRegions.push(prev)
        }
        break
      }
      case "keypoints": {
        const newPoints = {}
        for (const [pointId, prevPoint] of Object.entries(prev.points)) {
          newPoints[pointId] = {
            x: prevPoint.x * w1 + next.points[pointId].x * w2,
            y: prevPoint.y * w1 + next.points[pointId].y * w2,
          }
        }
        impliedRegions.push({
          ...prev,
          highlighted: false,
          editingLabels: false,
          points: newPoints,
        })
        break
      }
      default:
        break
    }
  }

  return impliedRegions
}
