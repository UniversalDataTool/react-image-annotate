

import type {
  Action,
  MainLayoutImageAnnotationState,
} from "../../MainLayout/types";
import getActiveImage from "./get-active-image";
import {produce} from 'immer';

export default (
  state: MainLayoutImageAnnotationState,
  action: Action
): MainLayoutImageAnnotationState => {
  const { currentImageIndex } = getActiveImage(state);

  switch (action.type) {
    case "IMAGE_LOADED": {
      if (!currentImageIndex) return state;
      return produce(state, (draft) => {
        // const idx = currentImageIndex.toString();
        const idx = currentImageIndex;
    
        if (!draft.images[idx]) return;
    
        draft.images[idx].pixelSize = {
          w: action.metadata.naturalWidth,
          h: action.metadata.naturalHeight,
        };
      });
    }
  }
  return state;
};
