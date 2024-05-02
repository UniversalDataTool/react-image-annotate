// @flow weak

import { useRef, useState } from "react";

export default (
  imageSrc: string,
  onImageLoaded: (metadata: { width: number; height: number }) => void
) => {
  const [imageLoaded, changeImageLoaded] = useState(false);
  const image = useRef<HTMLImageElement | null>(null);
  if (image.current === null) {
    image.current = new Image();
    image.current.onload = () => {
      changeImageLoaded(true);
      if (onImageLoaded && image.current)
        onImageLoaded({
          width: image.current.naturalWidth,
          height: image.current.naturalHeight,
        });
    };
    image.current.src = imageSrc;
  }
  return [image.current, imageLoaded];
};
