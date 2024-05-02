// @flow

export type BaseRegion = {
  id: string | number;
  cls?: string;
  locked?: boolean;
  visible?: boolean;
  color: string;
  editingLabels?: boolean;
  highlighted?: boolean;
  tags?: Array<string>;
  comment?: string;
};

export type Point = BaseRegion & {
  type: "point";
  x: number;
  y: number;
};

export type PixelRegion =
  | (BaseRegion & {
      type: "pixel";
      sx: number;
      sy: number;
      w: number;
      h: number;
      src: string;
    })
  | (BaseRegion & {
      type: "pixel";
      points: Array<[number, number]>;
    });

export type Box = BaseRegion & {
  type: "box";
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Polygon = BaseRegion & {
  type: "polygon";
  open?: boolean;
  points: Array<[number, number]>;
};

export type Line = BaseRegion & {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ExpandingLine = BaseRegion & {
  type: "expanding-line";
  points: Array<{
    x: number;
    y: number;
    angle: number | null;
    width: number | null;
  }>;
  expandingWidth?: number;
  candidatePoint?: { x: number; y: number };
  unfinished?: boolean;
};

export type KeypointDefinition = BaseRegion & {
  label: string;
  color: string;
  defaultPosition: [number, number];
};

export type KeypointId = string;

export type KeypointsDefinition = {
  [id: string]: {
    connections: Array<[KeypointId, KeypointId]>;
    landmarks: {
      [key: KeypointId]: KeypointDefinition;
    };
  };
};

export type Keypoints = BaseRegion & {
  type: "keypoints";
  keypointsDefinitionId: string;
  points: {
    [key: string]: { x: number; y: number };
  };
  open?: boolean;
};

export type Region =
  | Point
  | PixelRegion
  | Box
  | Polygon
  | ExpandingLine
  | Keypoints;
export const getEnclosingBox = (region: Region | Line) => {
  switch (region.type) {
    case "polygon": {
      const box = {
        x: Math.min(...region.points.map(([x]) => x)),
        y: Math.min(...region.points.map(([_, y]) => y)),
        w: 0,
        h: 0,
      };
      box.w = Math.max(...region.points.map(([x]) => x)) - box.x;
      box.h = Math.max(...region.points.map(([_, y]) => y)) - box.y;
      return box;
    }
    case "keypoints": {
      const minX = Math.min(...Object.values(region.points).map(({ x }) => x));
      const minY = Math.min(...Object.values(region.points).map(({ y }) => y));
      const maxX = Math.max(...Object.values(region.points).map(({ x }) => x));
      const maxY = Math.max(...Object.values(region.points).map(({ y }) => y));
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
      };
    }
    case "expanding-line": {
      const box = {
        x: Math.min(...region.points.map(({ x }) => x)),
        y: Math.min(...region.points.map(({ y }) => y)),
        w: 0,
        h: 0,
      };
      box.w = Math.max(...region.points.map(({ x }) => x)) - box.x;
      box.h = Math.max(...region.points.map(({ y }) => y)) - box.y;
      return box;
    }
    case "line": {
      return { x: region.x1, y: region.y1, w: 0, h: 0 };
    }
    case "box": {
      return { x: region.x, y: region.y, w: region.w, h: region.h };
    }
    case "point": {
      return { x: region.x, y: region.y, w: 0, h: 0 };
    }
    default: {
      return { x: 0, y: 0, w: 0, h: 0 };
    }
  }
};

export const moveRegion = (region: Region, x: number, y: number) => {
  switch (region.type) {
    case "point": {
      return { ...region, x, y };
    }
    case "box": {
      return { ...region, x: x - region.w / 2, y: y - region.h / 2 };
    }
  }
  return region;
};
