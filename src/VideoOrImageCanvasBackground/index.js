// @flow weak

import React, { useRef, useEffect, useMemo } from "react"
import { styled } from "@material-ui/core/styles"
import useEventCallback from "use-event-callback"

const Video = styled("video")({
  zIndex: 0,
  position: "absolute"
})

const StyledImage = styled("img")({
  zIndex: 0,
  position: "absolute"
})

export default ({
  imagePosition,
  mouseEvents,
  videoTime = 0,
  videoSrc,
  imageSrc,
  onLoad,
  videoPlaying,
  onChangeVideoTime,
  onChangeVideoPlaying
}) => {
  const videoRef = useRef()
  const imageRef = useRef()

  useEffect(() => {
    if (!videoPlaying && videoRef.current) {
      videoRef.current.currentTime = videoTime / 1000
    }
  }, [videoTime])

  useEffect(() => {
    let renderLoopRunning = false
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.play()
        renderLoopRunning = true
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

  const onLoadedVideoMetadata = useEventCallback(event => {
    const videoElm = event.currentTarget
    videoElm.currentTime = videoTime / 1000
    if (onLoad)
      onLoad({
        naturalWidth: videoElm.videoWidth,
        naturalHeight: videoElm.videoHeight,
        videoElm: videoElm,
        duration: videoElm.duration
      })
  })
  const onImageLoaded = useEventCallback(event => {
    const imageElm = event.currentTarget
    if (onLoad)
      onLoad({
        naturalWidth: imageElm.naturalWidth,
        naturalHeight: imageElm.naturalHeight,
        imageElm
      })
  })

  const stylePosition = useMemo(() => {
    let width = imagePosition.bottomRight.x - imagePosition.topLeft.x
    let height = imagePosition.bottomRight.y - imagePosition.topLeft.y
    return {
      left: imagePosition.topLeft.x,
      top: imagePosition.topLeft.y,
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height
    }
  }, [
    imagePosition.topLeft.x,
    imagePosition.topLeft.y,
    imagePosition.bottomRight.x,
    imagePosition.bottomRight.y
  ])

  if (!videoSrc && !imageSrc) return "No imageSrc or videoSrc provided"

  return imageSrc ? (
    <StyledImage
      {...mouseEvents}
      src={imageSrc}
      ref={imageRef}
      style={stylePosition}
      onLoad={onImageLoaded}
    />
  ) : (
    <Video
      {...mouseEvents}
      ref={videoRef}
      style={stylePosition}
      onLoadedMetadata={onLoadedVideoMetadata}
      src={videoSrc}
    />
  )
}
