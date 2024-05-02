// @flow weak
import useEventCallback from "use-event-callback";
import { getEnclosingBox, Region } from "../types/region-tools.ts";
import { CanvasLayoutParams } from "./index.tsx";
import { IMatrix } from "transformation-matrix-js";
import { MutableRefObject } from "react";

export type ProjectBox = IMatrix & {
  w: number;
  h: number;
};

export type ProjectBoxFn = (r: Region) => ProjectBox;

const UseProjectedBox = ({
  layoutParams,
  mat,
}: {
  layoutParams: MutableRefObject<CanvasLayoutParams | null>;
  mat: IMatrix;
}): ProjectBoxFn => {
  return useEventCallback((r: Region) => {
    const iw = layoutParams.current?.iw ?? 0;
    const ih = layoutParams.current?.ih ?? 0;
    const bbox = getEnclosingBox(r);
    const margin = r.type === "point" ? 15 : 2;
    const cbox = {
      x: bbox.x * iw - margin,
      y: bbox.y * ih - margin,
      w: bbox.w * iw + margin * 2,
      h: bbox.h * ih + margin * 2,
    };
    const pbox: ProjectBox = {
      ...mat.clone().inverse().applyToPoint(cbox.x, cbox.y),
      w: cbox.w / mat.a,
      h: cbox.h / mat.d,
    };
    return pbox;
  });
};

export default UseProjectedBox;
