import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useRef, useEffect, useMemo, useState } from "react";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useEventCallback from "use-event-callback";
import { useSettings } from "../SettingsProvider";
var theme = createTheme();
var Video = styled("video")(function (_ref) {
  var theme = _ref.theme;
  return {
    zIndex: 0,
    position: "absolute"
  };
});
var StyledImage = styled("img")(function (_ref2) {
  var theme = _ref2.theme;
  return {
    zIndex: 0,
    position: "absolute"
  };
});
var Error = styled("div")(function (_ref3) {
  var theme = _ref3.theme;
  return {
    zIndex: 0,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: "rgba(255,0,0,0.2)",
    color: "#ff0000",
    fontWeight: "bold",
    whiteSpace: "pre-wrap",
    padding: 50
  };
});
export default (function (_ref4) {
  var imagePosition = _ref4.imagePosition,
      mouseEvents = _ref4.mouseEvents,
      videoTime = _ref4.videoTime,
      videoSrc = _ref4.videoSrc,
      imageSrc = _ref4.imageSrc,
      onLoad = _ref4.onLoad,
      _ref4$useCrossOrigin = _ref4.useCrossOrigin,
      useCrossOrigin = _ref4$useCrossOrigin === void 0 ? false : _ref4$useCrossOrigin,
      videoPlaying = _ref4.videoPlaying,
      onChangeVideoTime = _ref4.onChangeVideoTime,
      onChangeVideoPlaying = _ref4.onChangeVideoPlaying;
  var settings = useSettings();
  var videoRef = useRef();
  var imageRef = useRef();

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      error = _useState2[0],
      setError = _useState2[1];

  useEffect(function () {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = (videoTime || 0) / 1000;
    }
  }, [videoTime]);
  useEffect(function () {
    var renderLoopRunning = false;

    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play();
        renderLoopRunning = true;

        if (settings.videoPlaybackSpeed) {
          videoRef.current.playbackRate = parseFloat(settings.videoPlaybackSpeed);
        }
      } else {
        videoRef.current.pause();
      }
    }

    function checkForNewFrame() {
      if (!renderLoopRunning) return;
      if (!videoRef.current) return;
      var newVideoTime = Math.floor(videoRef.current.currentTime * 1000);

      if (videoTime !== newVideoTime) {
        onChangeVideoTime(newVideoTime);
      }

      if (videoRef.current.paused) {
        renderLoopRunning = false;
        onChangeVideoPlaying(false);
      }

      requestAnimationFrame(checkForNewFrame);
    }

    checkForNewFrame();
    return function () {
      renderLoopRunning = false;
    };
  }, [videoPlaying]);
  var onLoadedVideoMetadata = useEventCallback(function (event) {
    var videoElm = event.currentTarget;
    videoElm.currentTime = (videoTime || 0) / 1000;
    if (onLoad) onLoad({
      naturalWidth: videoElm.videoWidth,
      naturalHeight: videoElm.videoHeight,
      videoElm: videoElm,
      duration: videoElm.duration
    });
  });
  var onImageLoaded = useEventCallback(function (event) {
    var imageElm = event.currentTarget;
    if (onLoad) onLoad({
      naturalWidth: imageElm.naturalWidth,
      naturalHeight: imageElm.naturalHeight,
      imageElm: imageElm
    });
  });
  var onImageError = useEventCallback(function (event) {
    setError("Could not load image\n\nMake sure your image works by visiting ".concat(imageSrc || videoSrc, " in a web browser. If that URL works, the server hosting the URL may be not allowing you to access the image from your current domain. Adjust server settings to enable the image to be viewed.").concat(!useCrossOrigin ? "" : "\n\nYour image may be blocked because it's not being sent with CORs headers. To do pixel segmentation, browser web security requires CORs headers in order for the algorithm to read the pixel data from the image. CORs headers are easy to add if you're using an S3 bucket or own the server hosting your images.", "\n\n If you need a hand, reach out to the community at universaldatatool.slack.com"));
  });
  var stylePosition = useMemo(function () {
    var width = imagePosition.bottomRight.x - imagePosition.topLeft.x;
    var height = imagePosition.bottomRight.y - imagePosition.topLeft.y;
    return {
      imageRendering: "pixelated",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height
    };
  }, [imagePosition.topLeft.x, imagePosition.topLeft.y, imagePosition.bottomRight.x, imagePosition.bottomRight.y]);
  if (!videoSrc && !imageSrc) return React.createElement(Error, null, "No imageSrc or videoSrc provided");
  if (error) return React.createElement(Error, null, error);
  return React.createElement(ThemeProvider, {
    theme: theme
  }, imageSrc && videoTime === undefined ? React.createElement(StyledImage, Object.assign({}, mouseEvents, {
    src: imageSrc,
    ref: imageRef,
    style: stylePosition,
    onLoad: onImageLoaded,
    onError: onImageError,
    crossOrigin: useCrossOrigin ? "anonymous" : undefined
  })) : React.createElement(Video, Object.assign({}, mouseEvents, {
    ref: videoRef,
    style: stylePosition,
    onLoadedMetadata: onLoadedVideoMetadata,
    src: videoSrc || imageSrc
  })));
});