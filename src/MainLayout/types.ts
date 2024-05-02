// @flow

import type {
  Box,
  KeypointDefinition,
  Keypoints,
  KeypointsDefinition,
  Point,
  Polygon,
  Region,
} from "../types/region-tools.ts";
import { AutosegOptions } from "autoseg/webworker";

export type AnnotatorToolEnum =
  | "select"
  | "pan"
  | "zoom"
  | "create-point"
  | "create-box"
  | "create-polygon"
  | "create-pixel"
  | "create-expanding-line"
  | "create-keypoints"
  | "modify-allowed-area"
  | "create-line"
  | "show-tags"
  | "show-mask";

export type Image = {
  src: string;
  thumbnailSrc?: string;
  name: string;
  regions?: Array<Region>;
  pixelSize?: { w: number; h: number };
  realSize?: { w: number; h: number; unitName: string };
  frameTime?: number;
  cls?: string;
  tags?: Array<string>;
};

export type VideoImage = {
  time: number;
  regions: Array<Region>;
  cls?: string;
  tags?: Array<string>;
};

export type Mode =
  | null
  | { mode: "DRAW_POLYGON"; regionId: string }
  | { mode: "MOVE_POLYGON_POINT"; regionId: string; pointIndex: number }
  | {
      mode: "RESIZE_BOX";
      editLabelEditorAfter?: boolean;
      regionId: string;
      freedom: [number, number];
      original: { x: number; y: number; w: number; h: number };
      isNew?: boolean;
    }
  | { mode: "MOVE_REGION"; regionId: string }
  | { mode: "MOVE_KEYPOINT"; regionId: string; keypointId: string }
  | {
      mode: "RESIZE_KEYPOINTS";
      landmarks: {
        [key: string]: KeypointDefinition;
      };
      centerX: number;
      centerY: number;
      regionId: string;
      isNew: boolean;
    }
  | {
      mode: "DRAW_LINE";
      regionId: string;
    }
  | {
      mode: "DRAW_EXPANDING_LINE";
      regionId: string;
    }
  | {
      mode: "SET_EXPANDING_LINE_WIDTH";
      regionId: string;
    }
  | {
      mode: "CREATE_POINT_LINE";
    };
export type RegionAllowedActions = {
  remove: boolean;
  lock: boolean;
  visibility: boolean;
};

export type MainLayoutStateBase = {
  annotationType: "video" | "image";
  mouseDownAt?: { x: number; y: number };
  fullScreen?: boolean;
  settingsOpen?: boolean;
  minRegionSize?: number;
  showTags: boolean;
  showMask: boolean;
  showPointDistances?: boolean;
  pointDistancePrecision?: number;
  selectedTool: AnnotatorToolEnum;
  selectedCls?: string;
  mode: Mode;
  taskDescription: string;
  allowedArea?: { x: number; y: number; w: number; h: number };
  regionClsList?: Array<string> | Array<{ id: string; label: string }>;
  regionTagList?: Array<string>;
  regionTagSingleSelection?: boolean;
  regionAllowedActions: RegionAllowedActions;
  imageClsList?: Array<string>;
  imageTagList?: Array<string>;
  enabledTools: Array<AnnotatorToolEnum>;
  history: Array<{ time: Date; state: MainLayoutState; name: string }>;
  keypointDefinitions: KeypointsDefinition;
  allowComments?: boolean;
  lastAction?: Action;
  fullImageSegmentationMode?: boolean;
  autoSegmentationOptions?: AutosegOptions;
  lastMouseMoveCall?: number;
};

export interface MainLayoutImageAnnotationState extends MainLayoutStateBase {
  annotationType: "image";

  selectedImage?: number;
  images: Array<Image>;
  labelImages?: boolean;

  // If the selectedImage corresponds to a frame of a video
  selectedImageFrameTime?: number;
}

export interface MainLayoutVideoAnnotationState extends MainLayoutStateBase {
  annotationType: "video";

  videoSrc: string;
  currentVideoTime: number;
  videoName?: string;
  videoPlaying: boolean;
  videoDuration: number;
  keyframes: {
    [time: number]: {
      time: number;
      regions: Array<Region>;
    };
  };
  pixelSize?: { w: number; h: number };
  realSize?: { w: number; h: number; unitName: string };
  lastMouseMoveCall?: number;
}

export type MainLayoutState =
  | MainLayoutImageAnnotationState
  | MainLayoutVideoAnnotationState;

export type Action =
  | { type: "@@INIT" }
  | { type: "SELECT_IMAGE"; image: Image; imageIndex: number }
  | {
      type: "IMAGE_OR_VIDEO_LOADED";
      metadata: {
        naturalWidth: number;
        naturalHeight: number;
        duration?: number;
      };
    }
  | { type: "CHANGE_REGION"; region: Region }
  | { type: "RESTORE_HISTORY" }
  | { type: "CLOSE_POLYGON"; polygon: Polygon }
  | { type: "SELECT_REGION"; region: Region }
  | { type: "BEGIN_MOVE_POINT"; point: Point }
  | { type: "BEGIN_BOX_TRANSFORM"; box: Box; directions: [number, number] }
  | { type: "BEGIN_MOVE_POLYGON_POINT"; polygon: Polygon; pointIndex: number }
  | { type: "BEGIN_MOVE_KEYPOINT"; region: Keypoints; keypointId: string }
  | {
      type: "ADD_POLYGON_POINT";
      polygon: Polygon;
      point: [number, number];
      pointIndex: number;
    }
  | { type: "MOUSE_MOVE"; x: number; y: number }
  | { type: "MOUSE_DOWN"; x: number; y: number }
  | { type: "MOUSE_UP"; x: number; y: number }
  | { type: "CHANGE_REGION"; region: Region }
  | { type: "OPEN_REGION_EDITOR"; region: Region }
  | { type: "CLOSE_REGION_EDITOR"; region: Region }
  | { type: "DELETE_REGION"; region: Region }
  | { type: "DELETE_SELECTED_REGION" }
  | { type: "HEADER_BUTTON_CLICKED"; buttonName: string }
  | { type: "SELECT_TOOL"; selectedTool: AnnotatorToolEnum }
  | { type: "CANCEL" }
  | { type: "SELECT_CLASSIFICATION"; cls: string }
  | { type: "ON_CLS_ADDED"; cls: string }
  | { type: "CHANGE_IMAGE"; delta: { cls?: string; tags?: string[] } }
  | { type: "CHANGE_VIDEO_TIME"; currentVideoTime: number; newTime: number }
  | { type: "CHANGE_VIDEO_PLAYING"; videoPlaying: boolean; isPlaying: boolean }
  | {
      type: "DELETE_KEYFRAME";
      keyframes: MainLayoutVideoAnnotationState["keyframes"];
      time: number;
    }
  | { type: "IMAGE_LOADED" };
