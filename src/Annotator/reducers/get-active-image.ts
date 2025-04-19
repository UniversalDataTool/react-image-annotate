import { Image, MainLayoutState } from "../../MainLayout/types";
import get from 'lodash/get';

export default (state: MainLayoutState) => {
  let currentImageIndex: number | null = null;
  let pathToActiveImage: string[] = [];
  let activeImage: Image | null = null;
  currentImageIndex = state.selectedImage ?? null;
  if (currentImageIndex === -1 || currentImageIndex === null) {
    currentImageIndex = null;
    activeImage = null;
  } else {
    pathToActiveImage = ["images", currentImageIndex.toString()];
    activeImage = get(state, pathToActiveImage);

  }
  return { currentImageIndex, pathToActiveImage, activeImage };
};
