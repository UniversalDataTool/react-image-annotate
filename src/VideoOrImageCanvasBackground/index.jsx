// @flow weak

import React, {useEffect, useMemo, useRef, useState} from "react"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import useEventCallback from "use-event-callback"
import {useSettings} from "../SettingsProvider"
import {useTranslation} from "react-i18next";

const theme = createTheme()
const Video = styled("video")(({theme}) => ({
  zIndex: 0,
  position: "absolute",
}))

const StyledImage = styled("img")(({theme}) => ({
  zIndex: 0,
  position: "absolute",
}))

const Error = styled("div")(({theme}) => ({
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
}))

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
}) => {
  const settings = useSettings()
  const videoRef = useRef()
  const imageRef = useRef()
  const [error, setError] = useState()

  useEffect(() => {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = (videoTime || 0) / 1000
    }
  }, [videoPlaying, videoTime])

  useEffect(() => {
    let renderLoopRunning = false
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play()
        renderLoopRunning = true
        if (settings.videoPlaybackSpeed) {
          videoRef.current.playbackRate = parseFloat(
            settings.videoPlaybackSpeed
          )
        }
      } else {
        videoRef.current.pause()
      }
    }

    function checkForNewFrame() {
      if (!renderLoopRunning) return
      if (!videoRef.current) return
      const newVideoTime = Math.floor(videoRef.current.currentTime * 1000)
      if (videoTime !== newVideoTime) {
        onChangeVideoTime(newVideoTime)
      }
      if (videoRef.current.paused) {
        renderLoopRunning = false
        onChangeVideoPlaying(false)
      }
      requestAnimationFrame(checkForNewFrame)
    }
    checkForNewFrame()

    return () => {
      renderLoopRunning = false
    }
  }, [onChangeVideoPlaying, onChangeVideoTime, settings.videoPlaybackSpeed, videoPlaying, videoTime])

  const onLoadedVideoMetadata = useEventCallback((event) => {
    const videoElm = event.currentTarget
    videoElm.currentTime = (videoTime || 0) / 1000
    if (onLoad)
      onLoad({
        naturalWidth: videoElm.videoWidth,
        naturalHeight: videoElm.videoHeight,
        videoElm: videoElm,
        duration: videoElm.duration,
      })
  })
  const onImageLoaded = useEventCallback((event) => {
    const imageElm = event.currentTarget
    if (onLoad)
      onLoad({
        naturalWidth: imageElm.naturalWidth,
        naturalHeight: imageElm.naturalHeight,
        imageElm,
      })
  })

  const {t} = useTranslation();

  const onImageError = useEventCallback((event) => {
    setError(
      (t("error.image"))
    )
  })

  const stylePosition = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y
    return {
      imageRendering: "pixelated",
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y,
  ])

  if (!videoSrc && !imageSrc)
    return <Error>No imageSrc or videoSrc provided</Error>

  if (error) return <Error>{error}</Error>

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
          src={videoSrc || imageSrc}
        />
      )}
    </ThemeProvider>
  )
}
