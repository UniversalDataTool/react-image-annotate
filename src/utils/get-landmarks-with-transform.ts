// @flow
import type { KeypointDefinition } from "../types/region-tools.ts";

type Parameters = {
  center: { x: number; y: number };
  scale: number;
  landmarks: {
    [key: string]: KeypointDefinition;
  };
};

export default ({ center, scale, landmarks }: Parameters) => {
  const points: Record<string, { x: number; y: number }> = {};
  for (const [keypointId, { defaultPosition }] of Object.entries(landmarks)) {
    points[keypointId] = {
      x: defaultPosition[0] * scale + center.x,
      y: defaultPosition[1] * scale + center.y,
    };
  }
  return points;
};
