// @flow weak

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import useEventCallback from "use-event-callback";
import { useSettings } from "../SettingsProvider";
import { ImagePosition } from "../types/common.ts";
import { MouseEvents } from "../ImageCanvas/use-mouse.ts";

const theme = createTheme();
const Video = styled("video")(() => ({
  zIndex: 0,
  position: "absolute",
}));

const StyledImage = styled("img")(() => ({
  zIndex: 0,
  position: "absolute",
}));

const Error = styled("div")(() => ({
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
  padding: 50,
}));

interface Props {
  imagePosition: ImagePosition | null;
  mouseEvents: MouseEvents;
  videoTime?: number;
  videoSrc: string | null;
  imageSrc: string | null;
  useCrossOrigin?: boolean;
  videoPlaying: boolean;
  onLoad?: (props: {
    naturalWidth: number;
    naturalHeight: number;
    duration?: number;
  }) => void;
  onChangeVideoTime: (time: number) => void;
  onChangeVideoPlaying?: (playing: boolean) => void;
}

export default ({
  imagePosition,
  mouseEvents,
  videoTime,
  videoSrc,
  imageSrc,
  onLoad,
  useCrossOrigin = false,
  videoPlaying,
  onChangeVideoTime,
  onChangeVideoPlaying,
}: Props) => {
  const settings = useSettings();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = (videoTime || 0) / 1000;
    }
  }, [videoTime]);

  useEffect(() => {
    let renderLoopRunning = false;
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play();
        renderLoopRunning = true;
        if (settings.videoPlaybackSpeed) {
          videoRef.current.playbackRate = parseFloat(
            settings.videoPlaybackSpeed
          );
        }
      } else {
        videoRef.current.pause();
      }
    }

    function checkForNewFrame() {
      if (!renderLoopRunning) return;
      if (!videoRef.current) return;
      const newVideoTime = Math.floor(videoRef.current.currentTime * 1000);
      if (videoTime !== newVideoTime) {
        onChangeVideoTime(newVideoTime);
      }
      if (videoRef.current.paused) {
        renderLoopRunning = false;
        if (onChangeVideoPlaying) {
          onChangeVideoPlaying(false);
        }
      }
      requestAnimationFrame(checkForNewFrame);
    }

    checkForNewFrame();

    return () => {
      renderLoopRunning = false;
    };
  }, [videoPlaying]);

  const onLoadedVideoMetadata = useEventCallback((event) => {
    const videoElm = event.currentTarget;
    videoElm.currentTime = (videoTime || 0) / 1000;
    if (onLoad)
      onLoad({
        naturalWidth: videoElm.videoWidth,
        naturalHeight: videoElm.videoHeight,
        duration: videoElm.duration,
      });
  });
  const onImageLoaded = useEventCallback((event) => {
    const imageElm = event.currentTarget;
    if (onLoad)
      onLoad({
        naturalWidth: imageElm.naturalWidth,
        naturalHeight: imageElm.naturalHeight,
      });
  });
  const onImageError = useEventCallback(() => {
    setError(
      `Could not load image\n\nMake sure your image works by visiting ${
        imageSrc || videoSrc
      } in a web browser. If that URL works, the server hosting the URL may be not allowing you to access the image from your current domain. Adjust server settings to enable the image to be viewed.${
        !useCrossOrigin
          ? ""
          : `\n\nYour image may be blocked because it's not being sent with CORs headers. To do pixel segmentation, browser web security requires CORs headers in order for the algorithm to read the pixel data from the image. CORs headers are easy to add if you're using an S3 bucket or own the server hosting your images.`
      }\n\n If you need a hand, reach out to the community at universaldatatool.slack.com`
    );
  });

  const stylePosition: CSSProperties = useMemo(() => {
    let width =
      (imagePosition?.bottomRight?.x ?? 0) - (imagePosition?.topLeft?.x ?? 0);
    let height =
      (imagePosition?.bottomRight?.y ?? 0) - (imagePosition?.topLeft?.y ?? 0);
    return {
      imageRendering: "pixelated",
      left: imagePosition?.topLeft?.x,
      top: imagePosition?.topLeft?.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
    };
  }, [imagePosition]);

  if (!videoSrc && !imageSrc)
    return <Error>No imageSrc or videoSrc provided</Error>;

  if (error) return <Error>{error}</Error>;

  return (
    <ThemeProvider theme={theme}>
      {imageSrc && videoTime === undefined ? (
        <StyledImage
          {...mouseEvents}
          src={imageSrc}
          ref={imageRef}
          style={stylePosition}
          onLoad={onImageLoaded}
          onError={onImageError}
          crossOrigin={useCrossOrigin ? "anonymous" : undefined}
        />
      ) : (
        <Video
          {...mouseEvents}
          ref={videoRef}
          style={stylePosition}
          onLoadedMetadata={onLoadedVideoMetadata}
          src={videoSrc || imageSrc!}
        />
      )}
    </ThemeProvider>
  );
};
