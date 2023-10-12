// @flow
import {setIn, without} from "seamless-immutable"

export default (state, action) => {

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED": {
      const {duration} = action.metadata
      if (typeof duration === "number") {
        return setIn(state, ["videoDuration"], duration * 1000)
      }
      return;
    }
    case "HEADER_BUTTON_CLICKED": {
      switch (action.buttonName.toLowerCase()) {
        case "play":
          return setIn(state, ["videoPlaying"], true)
        case "pause":
          return setIn(state, ["videoPlaying"], false)
        default:
          return setIn(state, ["videoPlaying"], false)
      }
    }
    case "CHANGE_VIDEO_TIME": {
      return setIn(state, ["currentVideoTime"], action.newTime)
    }
    case "CHANGE_VIDEO_PLAYING": {
      return setIn(state, ["videoPlaying"], action.isPlaying)
    }
    case "DELETE_KEYFRAME": {
      return setIn(state, ["keyframes"], without(state.keyframes, action.time))
    }
    default:
      return
  }
}
