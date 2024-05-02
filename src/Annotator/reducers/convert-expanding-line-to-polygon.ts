// @flow

import { clamp } from "../../utils/clamp";
import { ExpandingLine } from "../../types/region-tools.ts";
import Immutable from "seamless-immutable";

export default (expandingLine: ExpandingLine) => {
  const expandingWidth = expandingLine.expandingWidth || 0.005;
  const pointPairs = expandingLine.points.map(({ x, y, angle, width }, i) => {
    if (!angle) {
      const n =
        expandingLine.points[clamp(i + 1, 0, expandingLine.points.length - 1)];
      const p =
        expandingLine.points[clamp(i - 1, 0, expandingLine.points.length - 1)];
      angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2;
    }
    const dx = (Math.sin(angle) * (width || expandingWidth)) / 2;
    const dy = (Math.cos(angle) * (width || expandingWidth)) / 2;
    return [
      { x: x + dx, y: y + dy },
      { x: x - dx, y: y - dy },
    ];
  });
  const firstSection = pointPairs.map(([p1]) => p1);
  const secondSection = Immutable.asMutable(pointPairs.map(([_, p2]) => p2));
  secondSection.reverse();

  const newPoints = firstSection
    .concat(secondSection)
    .map(({ x, y }) => [x, y]);

  return {
    ...expandingLine,
    type: "polygon",
    open: false,
    points: newPoints,
    unfinished: undefined,
    candidatePoint: undefined,
  };
};
