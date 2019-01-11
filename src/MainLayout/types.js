// @flow

import type { Region } from "../ImageCanvas/region-tools.js"

type ToolEnum =
  | "select"
  | "pan"
  | "zoom"
  | "create-point"
  | "create-box"
  | "create-polygon"
  | "create-pixel"

export type MainLayoutState = {|
  showTags: boolean,
  selectedImage: string,
  selectedTool: ToolEnum,
  taskDescription: string,
  images: Array<{
    src: string,
    thumbnailSrc?: string,
    name: string,
    regions?: Array<Region>
  }>,
  clsList: Array<string>,
  tagList: Array<string>,
  enabledTools: Array<string>,
  history: Array<{ time: Date, state: MainLayoutState, name: string }>
|}

export type Action = {| type: "@@INIT" |}
