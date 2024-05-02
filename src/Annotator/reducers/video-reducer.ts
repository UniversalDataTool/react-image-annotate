// @flow

import type {
  Action,
  MainLayoutVideoAnnotationState,
} from "../../MainLayout/types";
import Immutable, { ImmutableObject } from "seamless-immutable";
import getImpliedVideoRegions from "./get-implied-video-regions";
import { saveToHistory } from "./history-handler";

export default (
  state: ImmutableObject<MainLayoutVideoAnnotationState>,
  action: Action
): ImmutableObject<MainLayoutVideoAnnotationState> => {
  const copyImpliedRegions = () => {
    const newState = Immutable(
      saveToHistory(Immutable(state), "Add Keyframe")
    ) as ImmutableObject<MainLayoutVideoAnnotationState>;

    return newState.setIn(["keyframes", `${state.currentVideoTime || 0}`], {
      regions: getImpliedVideoRegions(
        newState.keyframes.asMutable({ deep: true }),
        state.currentVideoTime
      ),
    });
  };

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED": {
      const { duration } = action.metadata;
      if (typeof duration === "number") {
        return Immutable(state).setIn(["videoDuration"], duration * 1000);
      }
      break;
    }
    case "HEADER_BUTTON_CLICKED": {
      if ("buttonName" in action) {
        switch (action.buttonName.toLowerCase()) {
          case "play":
            return Immutable(state).setIn(["videoPlaying"], true);

          case "pause":
            return Immutable(state).setIn(["videoPlaying"], false);
        }
      }
      break;
    }
    case "CHANGE_VIDEO_TIME": {
      return Immutable(state).setIn(["currentVideoTime"], action.newTime);
    }
    case "CHANGE_VIDEO_PLAYING": {
      return Immutable(state).setIn(["videoPlaying"], action.isPlaying);
    }
    case "DELETE_KEYFRAME": {
      return Immutable(state).setIn(
        ["keyframes"],
        Immutable(state.keyframes).without(action.time)
      );
    }
    default:
      break;
  }

  // Before the user modifies regions, copy the interpolated regions over to a
  // new keyframe
  if (!state.keyframes[state.currentVideoTime]) {
    switch (action.type) {
      case "BEGIN_BOX_TRANSFORM":
      case "BEGIN_MOVE_POINT":
      case "BEGIN_MOVE_KEYPOINT":
      case "BEGIN_MOVE_POLYGON_POINT":
      case "ADD_POLYGON_POINT":
      case "SELECT_REGION":
      case "CHANGE_REGION":
      case "DELETE_REGION":
      case "OPEN_REGION_EDITOR":
        return copyImpliedRegions();
      case "MOUSE_DOWN": {
        switch (state.selectedTool) {
          case "create-point":
          case "create-polygon":
          case "create-box":
          case "create-keypoints":
            return copyImpliedRegions();
          default:
            break;
        }
        break;
      }
      default:
        break;
    }
  }

  return state;
};
