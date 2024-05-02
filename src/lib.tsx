// @flow

import Annotator from "./Annotator";

// re-export types
export type { AnnotatorProps } from "./Annotator";
export type {
  MainLayoutState,
  MainLayoutImageAnnotationState,
  MainLayoutVideoAnnotationState,
  MainLayoutStateBase,
  AnnotatorToolEnum,
} from "./MainLayout/types";

export type {
  Region,
  BaseRegion,
  Box,
  PixelRegion,
  ExpandingLine,
  KeypointDefinition,
  Keypoints,
  Line,
  Polygon,
  Point,
  KeypointsDefinition,
} from "./types/region-tools";

export { Annotator };

export default Annotator;
