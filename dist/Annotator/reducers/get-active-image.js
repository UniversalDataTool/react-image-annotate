import { getIn } from "seamless-immutable";
export default (function (state) {
  var currentImageIndex = null,
      pathToActiveImage,
      activeImage;

  if (state.annotationType === "image") {
    currentImageIndex = state.selectedImage;

    if (currentImageIndex === -1) {
      currentImageIndex = null;
      activeImage = null;
    } else {
      pathToActiveImage = ["images", currentImageIndex];
      activeImage = getIn(state, pathToActiveImage);
    }
  } else if (state.annotationType === "video") {
    pathToActiveImage = ["keyframes", state.currentVideoTime || 0];
    activeImage = getIn(state, pathToActiveImage) || null;
  }

  return {
    currentImageIndex: currentImageIndex,
    pathToActiveImage: pathToActiveImage,
    activeImage: activeImage
  };
});