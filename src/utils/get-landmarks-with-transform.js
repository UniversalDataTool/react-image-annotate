// @flow
import type { KeypointDefinition } from "../ImageCanvas/region-tools"

type Parameters = {
  center: { x: number, y: number },
  scale: number,
  landmarks: {
    [string]: KeypointDefinition,
  },
}

export default ({ center, scale, landmarks }: Parameters) => {
  const points = {}
  for (const [keypointId, { defaultPosition }] of (Object.entries(
    landmarks
  ): any)) {
    points[keypointId] = {
      x: defaultPosition[0] * scale + center.x,
      y: defaultPosition[1] * scale + center.y,
    }
  }
  return points
}
