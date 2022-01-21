// @flow weak

import React, { useRef, useEffect, useMemo, useState } from "react"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useEventCallback from "use-event-callback"
import { useSettings } from "../SettingsProvider"

const theme = createTheme()
const Video = styled("video")(({ theme }) => ({
  zIndex: 0,
  position: "absolute",
}))

const StyledImage = styled("img")(({ theme }) => ({
  zIndex: 0,
  position: "absolute",
}))

const Error = styled("div")(({ theme }) => ({
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
  }, [videoTime])

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
  }, [videoPlaying])

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
  const onImageError = useEventCallback((event) => {
    setError(
      `Could not load image\n\nMake sure your image works by visiting ${
        imageSrc || videoSrc
      } in a web browser. If that URL works, the server hosting the URL may be not allowing you to access the image from your current domain. Adjust server settings to enable the image to be viewed.${
        !useCrossOrigin
          ? ""
          : `\n\nYour image may be blocked because it's not being sent with CORs headers. To do pixel segmentation, browser web security requires CORs headers in order for the algorithm to read the pixel data from the image. CORs headers are easy to add if you're using an S3 bucket or own the server hosting your images.`
      }\n\n If you need a hand, reach out to the community at universaldatatool.slack.com`
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
