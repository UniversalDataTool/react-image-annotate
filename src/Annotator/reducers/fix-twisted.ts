// @flow

import { ExpandingLine } from "../../types/region-tools.ts";

export default (pointsWithAngles: ExpandingLine["points"]) => {
  // Adjacent angles should not have an angular distance of more than Math.PI
  return pointsWithAngles;
};
