import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { colorInts } from "../colors";
import { useDebounce } from "react-use";
import loadImage from "./load-image";
import autoseg from "autoseg/webworker";

function convertToUDTRegions(regions) {
  return regions.map(function (r) {
    switch (r.type) {
      case "point":
        {
          return {
            regionType: "point",
            classification: r.cls,
            x: r.x,
            y: r.y
          };
        }

      case "polygon":
        {
          return {
            regionType: "polygon",
            classification: r.cls,
            points: r.points.map(function (_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                  x = _ref2[0],
                  y = _ref2[1];

              return {
                x: x,
                y: y
              };
            })
          };
        }

      case "box":
        {
          return {
            regionType: "bounding-box",
            classification: r.cls,
            centerX: r.x + r.w / 2,
            centerY: r.y + r.h / 2,
            width: r.w,
            height: r.h
          };
        }

      default:
        {
          return null;
        }
    }
  }).filter(Boolean);
}

export var ImageMask = function ImageMask(_ref3) {
  var regions = _ref3.regions,
      regionClsList = _ref3.regionClsList,
      imageSrc = _ref3.imageSrc,
      imagePosition = _ref3.imagePosition,
      _ref3$zIndex = _ref3.zIndex,
      zIndex = _ref3$zIndex === void 0 ? 1 : _ref3$zIndex,
      _ref3$hide = _ref3.hide,
      hide = _ref3$hide === void 0 ? false : _ref3$hide,
      _ref3$autoSegmentatio = _ref3.autoSegmentationOptions,
      autoSegmentationOptions = _ref3$autoSegmentatio === void 0 ? {
    type: "simple"
  } : _ref3$autoSegmentatio;

  // if (!window.mmgc) window.mmgc = MMGC_INIT()
  // const mmgc = window.mmgc
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      canvasRef = _useState2[0],
      setCanvasRef = _useState2[1];

  var _useState3 = useState(),
      _useState4 = _slicedToArray(_useState3, 2),
      sampleImageData = _useState4[0],
      setSampleImageData = _useState4[1];

  useEffect(function () {
    if (!imageSrc) return;
    loadImage(imageSrc).then(function (imageData) {
      autoseg.setConfig(_objectSpread({
        classNames: regionClsList
      }, autoSegmentationOptions));
      autoseg.loadImage(imageData);
      setSampleImageData(imageData);
    });
  }, [imageSrc]);
  useDebounce(function () {
    if (hide) return;
    if (!canvasRef) return;
    if (!sampleImageData) return;
    if (regions.filter(function (cp) {
      return cp.cls;
    }).length < 2) return;
    var udtRegions = convertToUDTRegions(regions);
    autoseg.getMask(udtRegions).then(function (maskImageData) {
      var context = canvasRef.getContext("2d");
      context.clearRect(0, 0, maskImageData.width, maskImageData.height);
      context.putImageData(maskImageData, 0, 0);
    });
  }, 1000, [canvasRef, sampleImageData, regions, hide]);
  var style = useMemo(function () {
    var width = imagePosition.bottomRight.x - imagePosition.topLeft.x;
    var height = imagePosition.bottomRight.y - imagePosition.topLeft.y;
    return {
      display: hide ? "none" : undefined,
      imageRendering: "pixelated",
      transform: "translateZ(0px)",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      zIndex: zIndex,
      position: "absolute",
      pointerEvents: "none"
    };
  }, [imagePosition.topLeft.x, imagePosition.topLeft.y, imagePosition.bottomRight.x, imagePosition.bottomRight.y, zIndex, hide]);
  return React.createElement("canvas", {
    style: style,
    width: sampleImageData ? sampleImageData.width : 0,
    height: sampleImageData ? sampleImageData.height : 0,
    ref: setCanvasRef
  });
};
export default ImageMask;