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
  }
  return state
}
