// @flow

export type BaseRegion = {
  id: string | number,
  cls?: string,
  locked?: boolean,
  visible?: boolean,
  color: string,
  editingLabels?: boolean,
  highlighted?: boolean,
  tags?: Array<string>,
}

export type Point = {|
  ...$Exact<BaseRegion>,
  type: "point",
  x: number,
  y: number,
|}

export type PixelRegion =
  | {|
      ...$Exact<BaseRegion>,
      type: "pixel",
      sx: number,
      sy: number,
      w: number,
      h: number,
      src: string,
    |}
  | {|
      ...$Exact<BaseRegion>,
      type: "pixel",
      points: Array<[number, number]>,
    |}
export type Box = {|
  ...$Exact<BaseRegion>,
  type: "box",
  x: number,
  y: number,
  w: number,
  h: number,
|}

export type Polygon = {|
  ...$Exact<BaseRegion>,
  type: "polygon",
  open?: boolean,
  points: Array<[number, number]>,
|}

export type Line = {|
  ...$Exact<BaseRegion>,
  type: "line",
  x1: number,
  y1: number,
  x2: number,
  y2: number,
|}

export type ExpandingLine = {|
  ...$Exact<BaseRegion>,
  type: "expanding-line",
  points: Array<{ x: number, y: number, angle: number, width: number }>,
|}

export type KeypointDefinition = {|
  label: string,
  color: string,
  defaultPosition: [number, number],
|}

export type KeypointId = string

export type KeypointsDefinition = {|
  [id: string]: {
    connections: Array<[KeypointId, KeypointId]>,
    landmarks: {
      [KeypointId]: KeypointDefinition,
    },
  },
|}

export type Keypoints = {|
  ...$Exact<BaseRegion>,
  type: "keypoints",
  keypointsDefinitionId: string,
  points: {
    [string]: { x: number, y: number },
  },
|}

export type Region =
  | Point
  | PixelRegion
  | Box
  | Polygon
  | ExpandingLine
  | Keypoints

export const getEnclosingBox = (region: Region) => {
  switch (region.type) {
    case "polygon": {
      const box = {
        x: Math.min(...region.points.map(([x, y]) => x)),
        y: Math.min(...region.points.map(([x, y]) => y)),
        w: 0,
        h: 0,
      }
      box.w = Math.max(...region.points.map(([x, y]) => x)) - box.x
      box.h = Math.max(...region.points.map(([x, y]) => y)) - box.y
      return box
    }
    case "keypoints": {
      const minX = Math.min(
        ...Object.values(region.points).map(({ x, y }) => x)
      )
      const minY = Math.min(
        ...Object.values(region.points).map(({ x, y }) => y)
      )
      const maxX = Math.max(
        ...Object.values(region.points).map(({ x, y }) => x)
      )
      const maxY = Math.max(
        ...Object.values(region.points).map(({ x, y }) => y)
      )
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY,
      }
    }
    case "expanding-line": {
      const box = {
        x: Math.min(...region.points.map(({ x, y }) => x)),
        y: Math.min(...region.points.map(({ x, y }) => y)),
        w: 0,
        h: 0,
      }
      box.w = Math.max(...region.points.map(({ x, y }) => x)) - box.x
      box.h = Math.max(...region.points.map(({ x, y }) => y)) - box.y
      return box
    }
    case "line": {
      return { x: region.x1, y: region.y1, w: 0, h: 0 }
    }
    case "box": {
      return { x: region.x, y: region.y, w: region.w, h: region.h }
    }
    case "point": {
      return { x: region.x, y: region.y, w: 0, h: 0 }
    }
    default: {
      return { x: 0, y: 0, w: 0, h: 0 }
    }
  }
  throw new Error("unknown region")
}

export const moveRegion = (region: Region, x: number, y: number) => {
  switch (region.type) {
    case "point": {
      return { ...region, x, y }
    }
    case "box": {
      return { ...region, x: x - region.w / 2, y: y - region.h / 2 }
    }
  }
  return region
}
