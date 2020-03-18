// @flow

import type {
  MainLayoutVideoAnnotationState,
  Action
} from "../../MainLayout/types"
import { setIn } from "seamless-immutable"

export default (state: MainLayoutVideoAnnotationState, action: Action) => {
  if (!action.type.includes("MOUSE_")) console.log(action.type, action)

  const copyImpliedRegions = () => {
    const keyframeTimes = Object.keys(state.keyframes)
      .map(t => parseInt(t))
      .filter(a => !isNaN(a))

    keyframeTimes.sort((a, b) => b - a) // reverse sort
    const prevKeyframeTimeIndex = keyframeTimes.findIndex(
      kt => kt < state.currentVideoTime
    )
    if (prevKeyframeTimeIndex === -1) {
      return setIn(state, ["keyframes", state.currentVideoTime], {
        regions: []
      })
    }
    return setIn(state, ["keyframes", state.currentVideoTime], {
      regions: state.keyframes[keyframeTimes[prevKeyframeTimeIndex]].regions
    })
  }

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED": {
      const { duration } = action.metadata
      if (typeof duration === "number") {
        return setIn(state, ["videoDuration"], duration * 1000)
      }
    }
    case "HEADER_BUTTON_CLICKED": {
      switch (action.buttonName.toLowerCase()) {
        case "play":
          return setIn(state, ["videoPlaying"], true)
        case "pause":
          return setIn(state, ["videoPlaying"], false)
      }
    }
    case "CHANGE_VIDEO_TIME": {
      return setIn(state, ["currentVideoTime"], action.newTime)
    }
    case "CHANGE_VIDEO_PLAYING": {
      return setIn(state, ["videoPlaying"], action.isPlaying)
    }
  }

  // Before the user modifies regions, copy the interpolated regions over to a
  // new keyframe
  if (!state.keyframes[state.currentVideoTime]) {
    switch (action.type) {
      case "BEGIN_BOX_TRANSFORM":
      case "BEGIN_MOVE_POINT":
      case "BEGIN_MOVE_POLYGON_POINT":
      case "BEGIN_BOX_TRANSFORM":
      case "BEGIN_MOVE_POLYGON_POINT":
      case "ADD_POLYGON_POINT":
      case "CHANGE_REGION":
      case "DELETE_REGION":
        return copyImpliedRegions()
      case "MOUSE_DOWN": {
        switch (state.selectedTool) {
          case "create-point":
          case "create-polygon":
          case "create-box":
            return copyImpliedRegions()
        }
      }
    }
  }

  return state
}
