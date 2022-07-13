import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { useRef, useState } from "react";
export default (function (imageSrc, onImageLoaded) {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      imageLoaded = _useState2[0],
      changeImageLoaded = _useState2[1];

  var image = useRef(null);

  if (image.current === null) {
    image.current = new Image();

    image.current.onload = function () {
      changeImageLoaded(true);
      if (onImageLoaded) onImageLoaded({
        width: image.current.naturalWidth,
        height: image.current.naturalHeight
      });
    };

    image.current.src = imageSrc;
  }

  return [image.current, imageLoaded];
});