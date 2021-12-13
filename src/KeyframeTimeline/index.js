// @flow weak

import React, { useMemo, useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import range from "lodash/range"
import * as colors from "@mui/material/colors"
import useMeasure from "react-use-measure"
import useEventCallback from "use-event-callback"
import { useRafState } from "react-use"
import getTimeString from "./get-time-string"

const theme = createTheme()

const Container = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexGrow: 1,
  minWidth: 240,
  height: 64,
  marginLeft: 16,
  marginRight: 16,
}))

const Tick = styled("div")(({ theme }) => ({
  position: "absolute",
  width: 2,
  marginLeft: -1,
  height: "100%",
  backgroundColor: colors.grey[300],
  bottom: 0,
}))
const TickText = styled("div")(({ theme }) => ({
  position: "absolute",
  userSelect: "none",
  fontSize: 10,
  color: colors.grey[600],
  fontWeight: "bold",
  bottom: 0,
}))

const PositionCursor = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: "calc(50% + 6px)",
  fontSize: 10,
  fontWeight: "bold",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  width: 48,
  marginLeft: -24,
  borderRadius: 2,
  height: 24,
  backgroundColor: colors.blue[500],
  userSelect: "none",
  fontVariantNumeric: "tabular-nums",

  "&::before": {
    position: "absolute",
    bottom: -6,
    left: 24 - 8,
    content: '""',
    width: 0,
    height: 0,
    borderTop: `8px solid ${colors.blue[500]}`,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
  },
}))

const KeyframeMarker = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 8,
  cursor: "pointer",
  opacity: 0.75,
  fontSize: 10,
  fontWeight: "bold",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  width: 16,
  marginLeft: 0,
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2,
  height: 12,
  marginLeft: -8,
  backgroundColor: colors.red[500],
  userSelect: "none",
  fontVariantNumeric: "tabular-nums",

  "&::before": {
    position: "absolute",
    bottom: -8,
    left: 0,
    content: '""',
    width: 0,
    height: 0,
    borderTop: `8px solid ${colors.red[500]}`,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
  },
}))

const min = 60000
const displayIntervalPairs = [
  [50, 250],
  [100, 500],
  [250, 1000],
  [1000, 5000],
  [5000, 30000],
  [10000, min],
  [30000, min * 2],
  [min, min * 5],
  [min * 5, min * 30],
  [min * 10, min * 60],
  [min * 30, min * 60 * 3],
  [min * 60, min * 60 * 5],
]

const getMajorInterval = (duration) => {
  for (const [minor, major] of displayIntervalPairs) {
    if (duration / major < 6 && duration / major > 2) {
      return [minor, major]
    }
  }
  return [duration / 4, duration]
}

export default ({
  currentTime = 0,
  duration,
  onChangeCurrentTime,
  keyframes,
}) => {
  const [ref, bounds] = useMeasure()
  const [instantCurrentTime, changeInstantCurrentTime] = useState(currentTime)
  const [draggingTime, changeDraggingTime] = useRafState(false)
  const keyframeTimes = Object.keys(keyframes || {})
    .map((t) => parseInt(t))
    .filter((t) => !isNaN(t))
    .sort((a, b) => a - b)

  useEffect(() => {
    if (currentTime !== instantCurrentTime) {
      changeInstantCurrentTime(currentTime)
    }
  }, [currentTime])

  const [minorInterval, majorInterval] = useMemo(
    () => getMajorInterval(duration),
    [duration]
  )

  const onMouseMove = useEventCallback((e) => {
    if (draggingTime) {
      const px = (e.clientX - bounds.left) / bounds.width
      changeInstantCurrentTime(
        Math.min(duration, Math.max(0, Math.floor(px * duration)))
      )
    }
  })

  const onMouseUp = useEventCallback((e) => {
    changeDraggingTime(false)
    const px = (e.clientX - bounds.left) / bounds.width
    const newTime = Math.min(duration, Math.max(0, Math.floor(px * duration)))
    changeInstantCurrentTime(newTime)
    onChangeCurrentTime(newTime)
  })

  // TODO skeleton
  if (!duration) return null

  return (
    <ThemeProvider theme={theme}>
      <Container onMouseMove={onMouseMove} onMouseUp={onMouseUp} ref={ref}>
        {range(0, duration, majorInterval).map((a) => (
          <>
            <Tick
              key={a}
              style={{ left: (a / duration) * bounds.width, height: "50%" }}
            />
            <TickText
              style={{
                left: (a / duration) * bounds.width + 8,
                bottom: "calc(50% - 12px)",
              }}
            >
              {getTimeString(a)}
            </TickText>
          </>
        ))}
        {range(0, duration, minorInterval)
          .filter((a) => !Number.isInteger(a / majorInterval))
          .map((a) => (
            <Tick
              key={a}
              style={{
                left: (a / duration) * bounds.width,
                height: "25%",
              }}
            />
          ))}
        {keyframeTimes.map((kt) => (
          <KeyframeMarker
            onClick={() => onChangeCurrentTime(kt)}
            key={kt}
            style={{ left: (kt / duration) * bounds.width }}
          />
        ))}
        <PositionCursor
          onMouseDown={(e) => changeDraggingTime(true)}
          style={{
            cursor: draggingTime ? "grabbing" : "grab",
            left: (instantCurrentTime / duration) * bounds.width,
          }}
        >
          {getTimeString(instantCurrentTime)}
        </PositionCursor>
      </Container>
    </ThemeProvider>
  )
}
