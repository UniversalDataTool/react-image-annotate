// @flow

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

export default (expandingLine) => {
  const expandingWidth = expandingLine.expandingWidth || 0.005
  const pointPairs = expandingLine.points.map(({ x, y, angle, width }, i) => {
    if (!angle) {
      const n =
        expandingLine.points[clamp(i + 1, 0, expandingLine.points.length - 1)]
      const p =
        expandingLine.points[clamp(i - 1, 0, expandingLine.points.length - 1)]
      angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2
    }
    const dx = (Math.sin(angle) * (width || expandingWidth)) / 2
    const dy = (Math.cos(angle) * (width || expandingWidth)) / 2
    return [
      { x: x + dx, y: y + dy },
      { x: x - dx, y: y - dy },
    ]
  })
  const firstSection = pointPairs.map(([p1, p2]) => p1)
  const secondSection = pointPairs.map(([p1, p2]) => p2).asMutable()
  secondSection.reverse()

  const newPoints = firstSection.concat(secondSection).map(({ x, y }) => [x, y])

  return {
    ...expandingLine,
    type: "polygon",
    open: false,
    points: newPoints,
    unfinished: undefined,
    candidatePoint: undefined,
  }

  // let { expandingWidth = 0.005, points } = region
  // expandingWidth = points.slice(-1)[0].width || expandingWidth
  // const lastPoint = points.slice(-1)[0]
  // return (
  //   <>
  //     <polygon
  //       points={
  //         .map((p) => `${p.x * iw} ${p.y * ih}`)
  //         .join(" ")}
  // return {
  //   ...expandingLine,
  //   unfinished: undefined,
  //   candidatePoint: undefined,
  // }
}
