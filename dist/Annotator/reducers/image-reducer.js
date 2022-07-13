import { setIn } from "seamless-immutable";
import getActiveImage from "./get-active-image";
export default (function (state, action) {
  var _getActiveImage = getActiveImage(state),
      currentImageIndex = _getActiveImage.currentImageIndex,
      pathToActiveImage = _getActiveImage.pathToActiveImage,
      activeImage = _getActiveImage.activeImage;

  switch (action.type) {
    case "IMAGE_OR_VIDEO_LOADED":
      {
        return setIn(state, ["images", currentImageIndex, "pixelSize"], {
          w: action.metadata.naturalWidth,
          h: action.metadata.naturalHeight
        });
      }
  }

  return state;
});