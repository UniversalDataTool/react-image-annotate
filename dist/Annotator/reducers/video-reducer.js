import { setIn, without } from "seamless-immutable";
import getImpliedVideoRegions from "./get-implied-video-regions";
import { saveToHistory } from "./history-handler.js";
export default (function (state, action) {
  var copyImpliedRegions = function copyImpliedRegions() {
    return setIn(saveToHistory(state, "Add Keyframe"), ["keyframes", state.currentVideoTime || 0], {
      regions: getImpliedVideoRegions(state.keyframes, state.currentVideoTime)
    });
  };

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED":
      {
        var duration = action.metadata.duration;

        if (typeof duration === "number") {
          return setIn(state, ["videoDuration"], duration * 1000);
        }
      }

    case "HEADER_BUTTON_CLICKED":
      {
        switch (action.buttonName.toLowerCase()) {
          case "play":
            return setIn(state, ["videoPlaying"], true);

          case "pause":
            return setIn(state, ["videoPlaying"], false);
        }
      }

    case "CHANGE_VIDEO_TIME":
      {
        return setIn(state, ["currentVideoTime"], action.newTime);
      }

    case "CHANGE_VIDEO_PLAYING":
      {
        return setIn(state, ["videoPlaying"], action.isPlaying);
      }

    case "DELETE_KEYFRAME":
      {
        return setIn(state, ["keyframes"], without(state.keyframes, action.time));
      }

    default:
      break;
  } // Before the user modifies regions, copy the interpolated regions over to a
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

      case "MOUSE_DOWN":
        {
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
});