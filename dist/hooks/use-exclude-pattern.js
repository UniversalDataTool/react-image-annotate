import { useRef } from "react";
import excludePatternSrc from "./xpattern.js";
export default (function () {
  var excludePattern = useRef(null);

  if (excludePattern.current === null) {
    excludePattern.current = {
      image: new Image(),
      pattern: null
    };
    var canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    var context = canvas.getContext("2d");

    excludePattern.current.image.onload = function () {
      excludePattern.current.pattern = context.createPattern(excludePattern.current.image, "repeat");
    };

    excludePattern.current.image.src = excludePatternSrc;
  }

  return excludePattern.current.pattern;
});