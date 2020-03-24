// @flow

import type {
  MainLayoutImageAnnotationState,
  Action
} from "../../MainLayout/types"
import { setIn } from "seamless-immutable"
import getActiveImage from "./get-active-image"

export default (state: MainLayoutImageAnnotationState, action: Action) => {
  const { currentImageIndex, pathToActiveImage, activeImage } = getActiveImage(
    state
  )

  switch (action.type) {
    case "IMAGE_LOADED": {
      return setIn(state, ["images", currentImageIndex, "pixelSize"], {
        w: action.image.width,
        h: action.image.height
      })
    }
    case "GO_TO_NEXT_IMAGE": {
      return setIn(
        state,
        ["selectedImage"],
        (currentImageIndex + 1) % state.images.length
      )
    }
    case "GO_TO_PREVIOUS_IMAGE": {
      return (state.images.findIndex(img => img.src === state.selectedImage) - 1 + state.images.length) % state.images.length
    }
  }
  return state
}
