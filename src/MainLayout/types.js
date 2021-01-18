// @flow

import type {
  Region,
  Polygon,
  Box,
  Point,
  KeypointsDefinition,
  Keypoints,
  KeypointDefinition,
} from "../ImageCanvas/region-tools.js"

import type { Node } from "react"

export type ToolEnum =
  | "select"
  | "pan"
  | "zoom"
  | "create-point"
  | "create-box"
  | "create-polygon"
  | "create-pixel"
  | "create-expanding-line"
  | "create-keypoints"

export type Image = {
  src: string,
  thumbnailSrc?: string,
  name: string,
  regions?: Array<Region>,
  pixelSize?: { w: number, h: number },
  realSize?: { w: number, h: number, unitName: string },
  frameTime?: number,
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
      original: { x: number, y: number, w: number, h: number },
      isNew?: boolean,
    |}
  | {| mode: "MOVE_REGION" |}
  | {| mode: "MOVE_KEYPOINT", regionId: string, keypointId: string |}
  | {|
      mode: "RESIZE_KEYPOINTS",
      landmarks: {
        [string]: KeypointDefinition,
      },
      centerX: number,
      centerY: number,
      regionId: string,
      isNew: boolean,
    |}

export type MainLayoutStateBase = {|
  annotationType: "video" | "image",
  mouseDownAt?: ?{ x: number, y: number },
  fullScreen?: boolean,
  settingsOpen?: boolean,
  minRegionSize?: number,
  showTags: boolean,
  showMask: boolean,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  selectedTool: ToolEnum,
  selectedCls?: string,
  mode: Mode,
  taskDescription: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionClsList?: Array<string>,
  regionTagList?: Array<string>,
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,
  enabledTools: Array<string>,
  history: Array<{ time: Date, state: MainLayoutState, name: string }>,
  keypointDefinitions: KeypointsDefinition,
|}

export type MainLayoutImageAnnotationState = {|
  ...MainLayoutStateBase,
  annotationType: "image",

  selectedImage?: string,
  images: Array<Image>,
  labelImages?: boolean,

  // If the selectedImage corresponds to a frame of a video
  selectedImageFrameTime?: number,
|}

export type MainLayoutVideoAnnotationState = {|
  ...MainLayoutStateBase,
  annotationType: "video",

  videoSrc: string,
  currentVideoTime: number,
  videoName?: string,
  videoPlaying: boolean,
  videoDuration?: number,
  keyframes: {
    [time: number]: {|
      time: number,
      regions: Array<Region>,
    |},
  },
  pixelSize?: { w: number, h: number },
  realSize?: { w: number, h: number, unitName: string },
|}

export type MainLayoutState =
  | MainLayoutImageAnnotationState
  | MainLayoutVideoAnnotationState

export type Action =
  | {| type: "@@INIT" |}
  | {| type: "SELECT_IMAGE", image: Image, imageIndex: number |}
  | {|
      type: "IMAGE_OR_VIDEO_LOADED",
      metadata: {
        naturalWidth: number,
        naturalHeight: number,
        duration?: number,
      },
    |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "RESTORE_HISTORY" |}
  | {| type: "CLOSE_POLYGON", polygon: Polygon |}
  | {| type: "SELECT_REGION", region: Region |}
  | {| type: "BEGIN_MOVE_POINT", point: Point |}
  | {| type: "BEGIN_BOX_TRANSFORM", box: Box, directions: [number, number] |}
  | {| type: "BEGIN_MOVE_POLYGON_POINT", polygon: Polygon, pointIndex: number |}
  | {| type: "BEGIN_MOVE_KEYPOINT", region: Keypoints, keypointId: string |}
  | {|
      type: "ADD_POLYGON_POINT",
      polygon: Polygon,
      point: { x: number, y: number },
      pointIndex: number,
    |}
  | {| type: "MOUSE_MOVE", x: number, y: number |}
  | {| type: "MOUSE_DOWN", x: number, y: number |}
  | {| type: "MOUSE_UP", x: number, y: number |}
  | {| type: "CHANGE_REGION", region: Region |}
  | {| type: "OPEN_REGION_EDITOR", region: Region |}
  | {| type: "CLOSE_REGION_EDITOR", region: Region |}
  | {| type: "DELETE_REGION", region: Region |}
  | {| type: "DELETE_SELECTED_REGION" |}
  | {| type: "HEADER_BUTTON_CLICKED", buttonName: string |}
  | {| type: "SELECT_TOOL", selectedTool: ToolEnum |}
  | {| type: "CANCEL" |}
  | {| type: "SELECT_CLASSIFICATION", cls: string |}
