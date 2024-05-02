import Immutable, { ImmutableObject } from "seamless-immutable";
import { Image, MainLayoutState, VideoImage } from "../../MainLayout/types";

export default (state: ImmutableObject<MainLayoutState>) => {
  let currentImageIndex: number | null = null;
  let pathToActiveImage: string[] = [];
  let activeImage: Image | VideoImage | null = null;
  if (state.annotationType === "image") {
    currentImageIndex = state.selectedImage ?? null;
    if (currentImageIndex === -1 || currentImageIndex === null) {
      currentImageIndex = null;
      activeImage = null;
    } else {
      pathToActiveImage = ["images", currentImageIndex.toString()];
      activeImage = Immutable(state).getIn(pathToActiveImage);
    }
  } else if (state.annotationType === "video") {
    pathToActiveImage = ["keyframes", `${state.currentVideoTime || 0}`];
    activeImage = Immutable(state).getIn(pathToActiveImage) || null;
  }
  return { currentImageIndex, pathToActiveImage, activeImage };
};
