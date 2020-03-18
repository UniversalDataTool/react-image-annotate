import { getIn } from "seamless-immutable"

export default state => {
  let currentImageIndex = null,
    pathToActiveImage,
    activeImage
  if (state.annotationType === "image") {
    currentImageIndex = state.images.findIndex(
      img =>
        img.src === state.selectedImage &&
        (state.selectedImageFrameTime === undefined ||
          img.frameTime === state.selectedImageFrameTime)
    )
    if (currentImageIndex === -1) {
      currentImageIndex = null
      activeImage = null
    } else {
      pathToActiveImage = ["images", currentImageIndex]
      activeImage = getIn(state, pathToActiveImage)
    }
  } else if (state.annotationType === "video") {
    pathToActiveImage = ["keyframes", state.currentVideoTime || 0]
    activeImage = getIn(state, pathToActiveImage) || null
  }
  return { currentImageIndex, pathToActiveImage, activeImage }
}
