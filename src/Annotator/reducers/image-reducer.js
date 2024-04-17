// @flow
import {setIn} from "seamless-immutable"
import getActiveImage from "./get-active-image"

export default (state, action) => {
  const {currentImageIndex} =
    getActiveImage(state)

  if (action.type === "IMAGE_OR_VIDEO_LOADED") {
    return setIn(state, ["images", currentImageIndex, "pixelSize"], {
      w: action.metadata.naturalWidth,
      h: action.metadata.naturalHeight,
    });
  }
  return state
}
