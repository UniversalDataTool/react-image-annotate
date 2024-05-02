// @flow weak

import { useRef } from "react";
import excludePatternSrc from "./xpattern";

export default (): CanvasPattern | null => {
  const excludePattern = useRef<{
    image: HTMLImageElement;
    pattern: CanvasPattern | null;
  } | null>(null);

  if (excludePattern.current === null) {
    excludePattern.current = {
      image: new Image(),
      pattern: null,
    };
    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    const context = canvas.getContext("2d");
    if (!context) return null;
    excludePattern.current.image.onload = () => {
      if (excludePattern.current) {
        excludePattern.current.pattern = context.createPattern(
          excludePattern.current.image,
          "repeat"
        );
      }
    };
    excludePattern.current.image.src = excludePatternSrc;
  }
  return excludePattern.current.pattern;
};
