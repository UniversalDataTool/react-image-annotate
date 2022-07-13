import { useRef } from "react";
import { Matrix } from "transformation-matrix-js";

var getDefaultMat = function getDefaultMat() {
  return Matrix.from(1, 0, 0, 1, -10, -10);
};

export default (function (_ref) {
  var canvasEl = _ref.canvasEl,
      changeMat = _ref.changeMat,
      changeDragging = _ref.changeDragging,
      zoomStart = _ref.zoomStart,
      zoomEnd = _ref.zoomEnd,
      changeZoomStart = _ref.changeZoomStart,
      changeZoomEnd = _ref.changeZoomEnd,
      layoutParams = _ref.layoutParams,
      zoomWithPrimary = _ref.zoomWithPrimary,
      dragWithPrimary = _ref.dragWithPrimary,
      mat = _ref.mat,
      _onMouseMove = _ref.onMouseMove,
      _onMouseUp = _ref.onMouseUp,
      _onMouseDown = _ref.onMouseDown,
      dragging = _ref.dragging;
  var mousePosition = useRef({
    x: 0,
    y: 0
  });
  var prevMousePosition = useRef({
    x: 0,
    y: 0
  });

  var zoomIn = function zoomIn(direction, point) {
    var _ref2 = [point.x, point.y],
        mx = _ref2[0],
        my = _ref2[1];
    var scale = typeof direction === "object" ? direction.to / mat.a : 1 + 0.2 * direction; // NOTE: We're mutating mat here

    mat.translate(mx, my).scaleU(scale);
    if (mat.a > 2) mat.scaleU(2 / mat.a);
    if (mat.a < 0.05) mat.scaleU(0.05 / mat.a);
    mat.translate(-mx, -my);
    changeMat(mat.clone());
  };

  var mouseEvents = {
    onMouseMove: function onMouseMove(e) {
      var _canvasEl$current$get = canvasEl.current.getBoundingClientRect(),
          left = _canvasEl$current$get.left,
          top = _canvasEl$current$get.top;

      prevMousePosition.current.x = mousePosition.current.x;
      prevMousePosition.current.y = mousePosition.current.y;
      mousePosition.current.x = e.clientX - left;
      mousePosition.current.y = e.clientY - top;
      var projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y);

      if (zoomWithPrimary && zoomStart) {
        changeZoomEnd(projMouse);
      }

      var _layoutParams$current = layoutParams.current,
          iw = _layoutParams$current.iw,
          ih = _layoutParams$current.ih;

      _onMouseMove({
        x: projMouse.x / iw,
        y: projMouse.y / ih
      });

      if (dragging) {
        mat.translate(prevMousePosition.current.x - mousePosition.current.x, prevMousePosition.current.y - mousePosition.current.y);
        changeMat(mat.clone());
      }

      e.preventDefault();
    },
    onMouseDown: function onMouseDown(e) {
      var specialEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      e.preventDefault();
      if (e.button === 1 || e.button === 2 || e.button === 0 && dragWithPrimary) return changeDragging(true);
      var projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y);

      if (zoomWithPrimary && e.button === 0) {
        changeZoomStart(projMouse);
        changeZoomEnd(projMouse);
        return;
      }

      if (e.button === 0) {
        if (specialEvent.type === "resize-box") {// onResizeBox()
        }

        if (specialEvent.type === "move-region") {// onResizeBox()
        }

        var _layoutParams$current2 = layoutParams.current,
            iw = _layoutParams$current2.iw,
            ih = _layoutParams$current2.ih;

        _onMouseDown({
          x: projMouse.x / iw,
          y: projMouse.y / ih
        });
      }
    },
    onMouseUp: function onMouseUp(e) {
      e.preventDefault();
      var projMouse = mat.applyToPoint(mousePosition.current.x, mousePosition.current.y);

      if (zoomStart) {
        var _zoomEnd = projMouse;

        if (Math.abs(zoomStart.x - _zoomEnd.x) < 10 && Math.abs(zoomStart.y - _zoomEnd.y) < 10) {
          if (mat.a < 1) {
            zoomIn({
              to: 1
            }, mousePosition.current);
          } else {
            zoomIn({
              to: 0.25
            }, mousePosition.current);
          }
        } else {
          var _layoutParams$current3 = layoutParams.current,
              iw = _layoutParams$current3.iw,
              ih = _layoutParams$current3.ih;

          if (zoomStart.x > _zoomEnd.x) {
            ;
            var _ref3 = [_zoomEnd.x, zoomStart.x];
            zoomStart.x = _ref3[0];
            _zoomEnd.x = _ref3[1];
          }

          if (zoomStart.y > _zoomEnd.y) {
            ;
            var _ref4 = [_zoomEnd.y, zoomStart.y];
            zoomStart.y = _ref4[0];
            _zoomEnd.y = _ref4[1];
          } // The region defined by zoomStart and zoomEnd should be the new transform


          var scale = Math.min((_zoomEnd.x - zoomStart.x) / iw, (_zoomEnd.y - zoomStart.y) / ih);
          if (scale < 0.05) scale = 0.05;
          if (scale > 10) scale = 10;
          var newMat = getDefaultMat().translate(zoomStart.x, zoomStart.y).scaleU(scale);
          changeMat(newMat.clone());
        }

        changeZoomStart(null);
        changeZoomEnd(null);
      }

      if (e.button === 1 || e.button === 2 || e.button === 0 && dragWithPrimary) return changeDragging(false);

      if (e.button === 0) {
        var _layoutParams$current4 = layoutParams.current,
            _iw = _layoutParams$current4.iw,
            _ih = _layoutParams$current4.ih;

        _onMouseUp({
          x: projMouse.x / _iw,
          y: projMouse.y / _ih
        });
      }
    },
    onWheel: function onWheel(e) {
      var direction = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0;
      zoomIn(direction, mousePosition.current); // e.preventDefault()
    },
    onContextMenu: function onContextMenu(e) {
      e.preventDefault();
    }
  };
  return {
    mouseEvents: mouseEvents,
    mousePosition: mousePosition
  };
});