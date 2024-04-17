export default ({ center, scale, landmarks }) => {
  const points = {}
  for (const [keypointId, { defaultPosition }] of (Object.entries(
    landmarks
  ))) {
    points[keypointId] = {
      x: defaultPosition[0] * scale + center.x,
      y: defaultPosition[1] * scale + center.y,
    }
  }
  return points
}
