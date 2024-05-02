// @flow

import type {
  Action,
  MainLayoutImageAnnotationState,
} from "../../MainLayout/types";
import Immutable, { ImmutableObject } from "seamless-immutable";
import getActiveImage from "./get-active-image";

export default (
  state: ImmutableObject<MainLayoutImageAnnotationState>,
  action: Action
): ImmutableObject<MainLayoutImageAnnotationState> => {
  const { currentImageIndex } = getActiveImage(Immutable(state));

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED": {
      if (!currentImageIndex) return state;
      return Immutable(state).setIn(
        ["images", currentImageIndex.toString(), "pixelSize"],
        {
          w: action.metadata.naturalWidth,
          h: action.metadata.naturalHeight,
        }
      );
    }
  }
  return state;
};
