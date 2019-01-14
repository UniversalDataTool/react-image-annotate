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
  regions?: Array<Region>
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
  showTags: boolean,
  selectedImage?: string,
  selectedTool: ToolEnum,
  mode: Mode,
  taskDescription: string,
  images: Array<Image>,
  clsList: Array<string>,
  tagList: Array<string>,
  enabledTools: Array<string>,
  history: Array<{ time: Date, state: MainLayoutState, name: string }>
|}

export type Action =
  | {| type: "@@INIT" |}
  | {| type: "SELECT_IMAGE", image: Image |}
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
  | {| type: "DELETE_REGION", region: Region |}
  | {| type: "HEADER_BUTTON_CLICKED", buttonName: string |}
  | {| type: "SELECT_TOOL", selectedTool: string |}
  | {| type: "CANCEL" |}
