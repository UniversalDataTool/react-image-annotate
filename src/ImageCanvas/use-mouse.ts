// @flow weak

import { MouseEvent, MutableRefObject, useRef, WheelEvent } from "react";
import { IMatrix, Matrix } from "transformation-matrix-js";

const getDefaultMat = () => Matrix.from(1, 0, 0, 1, -10, -10);

type UseMouseProps = {
  canvasEl: MutableRefObject<HTMLCanvasElement | null>;
  changeMat: (mat: IMatrix) => void;
  changeDragging: (dragging: boolean) => void;
  zoomStart: { x: number; y: number } | null;
  zoomEnd: { x: number; y: number } | null;
  changeZoomStart: (point: { x: number; y: number } | null) => void;
  changeZoomEnd: (point: { x: number; y: number } | null) => void;
  layoutParams: MutableRefObject<{ iw: number; ih: number } | null>;
  zoomWithPrimary: boolean;
  dragWithPrimary: boolean;
  mat: IMatrix;
  onMouseMove: (point: { x: number; y: number }) => void;
  onMouseUp: (point: { x: number; y: number }) => void;
  onMouseDown: (point: { x: number; y: number }) => void;
  dragging: boolean;
};

export type MouseEvents = {
  onMouseMove: (e: MouseEvent) => void;
  onMouseDown: (e: MouseEvent, specialEvent?: { type?: string }) => void;
  onMouseUp: (e: MouseEvent) => void;
  onWheel: (e: WheelEvent) => void;
  onContextMenu: (e: MouseEvent) => void;
};

export type MenuPosition = { x: number; y: number };

export type UseMouseReturn = {
  mouseEvents: MouseEvents;
  mousePosition: MutableRefObject<MenuPosition>;
};

export default ({
  canvasEl,
  changeMat,
  changeDragging,
  zoomStart,
  changeZoomStart,
  changeZoomEnd,
  layoutParams,
  zoomWithPrimary,
  dragWithPrimary,
  mat,
  onMouseMove,
  onMouseUp,
  onMouseDown,
  dragging,
}: UseMouseProps): UseMouseReturn => {
  const mousePosition = useRef({ x: 0, y: 0 });
  const prevMousePosition = useRef({ x: 0, y: 0 });

  const zoomIn = (
    direction: { to: number } | number,
    point: { x: number; y: number }
  ) => {
    const [mx, my] = [point.x, point.y];
    let scale =
      typeof direction === "object"
        ? direction.to / mat.a
        : 1 + 0.2 * direction;

    // NOTE: We're mutating mat here
    mat.translate(mx, my).scaleU(scale);
    if (mat.a > 2) mat.scaleU(2 / mat.a);
    if (mat.a < 0.05) mat.scaleU(0.05 / mat.a);
    mat.translate(-mx, -my);

    changeMat(mat.clone());
  };

  const mouseEvents = {
    onMouseMove: (e: MouseEvent) => {
      const rect = canvasEl.current?.getBoundingClientRect();
      if (!rect) return;
      prevMousePosition.current.x = mousePosition.current.x;
      prevMousePosition.current.y = mousePosition.current.y;
      mousePosition.current.x = e.clientX - rect.left;
      mousePosition.current.y = e.clientY - rect.top;

      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );

      if (zoomWithPrimary && zoomStart) {
        changeZoomEnd(projMouse);
      }
      if (layoutParams.current) {
        const { iw, ih } = layoutParams.current;
        onMouseMove({ x: projMouse.x / iw, y: projMouse.y / ih });
      }

      if (dragging) {
        mat.translate(
          prevMousePosition.current.x - mousePosition.current.x,
          prevMousePosition.current.y - mousePosition.current.y
        );

        changeMat(mat.clone());
      }
      e.preventDefault();
    },
    onMouseDown: (e: MouseEvent, specialEvent: { type?: string } = {}) => {
      e.preventDefault();

      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
        return changeDragging(true);

      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
      if (zoomWithPrimary && e.button === 0) {
        changeZoomStart(projMouse);
        changeZoomEnd(projMouse);
        return;
      }
      if (e.button === 0) {
        if (specialEvent.type === "resize-box") {
          // onResizeBox()
        }
        if (specialEvent.type === "move-region") {
          // onResizeBox()
        }
        if (layoutParams.current) {
          const { iw, ih } = layoutParams.current;
          onMouseDown({ x: projMouse.x / iw, y: projMouse.y / ih });
        }
      }
    },
    onMouseUp: (e: MouseEvent) => {
      e.preventDefault();
      const projMouse = mat.applyToPoint(
        mousePosition.current.x,
        mousePosition.current.y
      );
      if (zoomStart) {
        const zoomEnd = projMouse;
        if (
          Math.abs(zoomStart.x - zoomEnd.x) < 10 &&
          Math.abs(zoomStart.y - zoomEnd.y) < 10
        ) {
          if (mat.a < 1) {
            zoomIn({ to: 1 }, mousePosition.current);
          } else {
            zoomIn({ to: 0.25 }, mousePosition.current);
          }
        } else {
          if (zoomStart.x > zoomEnd.x) {
            [zoomStart.x, zoomEnd.x] = [zoomEnd.x, zoomStart.x];
          }
          if (zoomStart.y > zoomEnd.y) {
            [zoomStart.y, zoomEnd.y] = [zoomEnd.y, zoomStart.y];
          }

          if (!layoutParams.current) return;
          const { iw, ih } = layoutParams.current;

          // The region defined by zoomStart and zoomEnd should be the new transform
          let scale = Math.min(
            (zoomEnd.x - zoomStart.x) / iw,
            (zoomEnd.y - zoomStart.y) / ih
          );
          if (scale < 0.05) scale = 0.05;
          if (scale > 10) scale = 10;

          const newMat = getDefaultMat()
            .translate(zoomStart.x, zoomStart.y)
            .scaleU(scale);

          changeMat(newMat.clone());
        }

        changeZoomStart(null);
        changeZoomEnd(null);
      }
      if (
        e.button === 1 ||
        e.button === 2 ||
        (e.button === 0 && dragWithPrimary)
      )
        return changeDragging(false);
      if (e.button === 0 && layoutParams.current) {
        const { iw, ih } = layoutParams.current;
        onMouseUp({ x: projMouse.x / iw, y: projMouse.y / ih });
      }
    },
    onWheel: (e: WheelEvent) => {
      const direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      zoomIn(direction, mousePosition.current);
      // e.preventDefault()
    },
    onContextMenu: (e: MouseEvent) => {
      e.preventDefault();
    },
  };
  return { mouseEvents, mousePosition };
};
