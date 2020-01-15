// @flow

import type {
  Region,
  Polygon,
  Box,
  Point
} from "../ImageCanvas/region-tools.js"

export type ToolEnum =
  | "select"
  | "pan"
  | "zoom"
  | "create-point"
  | "create-box"
  | "create-polygon"
  | "create-pixel"

export type Image = {
  src: string,
  thumbnailSrc?: string,
  name: string,
  regions?: Array<Region>,
  pixelSize?: { w: number, h: number },
  realSize?: { w: number, h: number, unitName: string }
}

export type Mode =
  | null
  | {| mode: "DRAW_POLYGON", regionId: string |}
  | {| mode: "MOVE_POLYGON_POINT", regionId: string, pointIndex: number |}
  | {|
      mode: "RESIZE_BOX",
      editLabelEditorAfter?: boolean,
      regionId: string,
      freedom: [number, number],
      original: { x: number, y: number, w: number, h: number }
    |}
  | {| mode: "MOVE_REGION" |}

export type MainLayoutState = {|
  fullScreen?: boolean,
  settingsOpen?: boolean,
  minRegionSize?: number,
  showTags: boolean,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  selectedImage?: string,
  selectedTool: ToolEnum,
  mode: Mode,
  taskDescription: string,
  images: Array<Image>,
  labelImages?: boolean,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionClsList?: Array<string>,
  regionTagList?: Array<string>,
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,
  enabledTools: Array<string>,
  history: Array<{ time: Date, state: MainLayoutState, name: string }>
|}

export type Action =
  | {| type: "@@INIT" |}
  | {| type: "SELECT_IMAGE", image: Image |}
  | {| type: "IMAGE_LOADED", image: { width: number, height: number } |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "RESTORE_HISTORY" |}
  | {| type: "CLOSE_POLYGON", polygon: Polygon |}
  | {| type: "SELECT_REGION", region: Region |}
  | {| type: "BEGIN_MOVE_POINT", point: Point |}
  | {| type: "BEGIN_BOX_TRANSFORM", box: Box, directions: [number, number] |}
  | {| type: "BEGIN_MOVE_POLYGON_POINT", polygon: Polygon, pointIndex: number |}
  | {|
      type: "ADD_POLYGON_POINT",
      polygon: Polygon,
      point: { x: number, y: number },
      pointIndex: number
    |}
  | {| type: "MOUSE_MOVE", x: number, y: number |}
  | {| type: "MOUSE_DOWN", x: number, y: number |}
  | {| type: "MOUSE_UP", x: number, y: number |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "OPEN_REGION_EDITOR", region: Region |}
  | {| type: "CLOSE_REGION_EDITOR", region: Region |}
  | {| type: "ADD_CLASS", newClass: string|}
  | {| type: "DELETE_REGION", region: Region |}
  | {| type: "HEADER_BUTTON_CLICKED", buttonName: string |}
  | {| type: "SELECT_TOOL", selectedTool: string |}
  | {| type: "CANCEL" |}
