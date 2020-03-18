// @flow weak

import React, { useMemo, useState, useEffect } from "react"
import { styled } from "@material-ui/core/styles"
import range from "lodash/range"
import * as colors from "@material-ui/core/colors"
import useMeasure from "react-use-measure"
import useEventCallback from "use-event-callback"
import { useRafState } from "react-use"

const Container = styled("div")({
  position: "relative",
  display: "flex",
  flexGrow: 1,
  minWidth: 200,
  marginLeft: 16,
  marginRight: 16
})

const Tick = styled("div")({
  position: "absolute",
  width: 2,
  marginLeft: -1,
  height: "100%",
  backgroundColor: colors.grey[300],
  bottom: 0
})
const TickText = styled("div")({
  position: "absolute",
  userSelect: "none",
  fontSize: 10,
  color: colors.grey[600],
  fontWeight: "bold",
  bottom: 0
})

const PositionCursor = styled("div")({
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

  "&::before": {
    position: "absolute",
    bottom: -6,
    left: 24 - 8,
    content: '""',
    width: 0,
    height: 0,
    borderTop: `8px solid ${colors.blue[500]}`,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent"
  }
})

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
  [min * 60, min * 60 * 5]
]

const getMajorInterval = duration => {
  for (const [minor, major] of displayIntervalPairs) {
    if (duration / major < 6 && duration / major > 2) {
      return [minor, major]
    }
  }
  return [duration / 4, duration]
}

const getTimeString = ms => {
  if (ms < 1000) {
    return ms + "ms"
  } else {
    const secs = ms / 1000
    if (secs < 60) {
      if (Number.isInteger(secs)) {
        return secs + "s"
      } else {
        return secs.toFixed(1) + "s"
      }
    } else {
      const mins = secs / 60
      if (Number.isInteger(mins)) {
        return mins + "m"
      } else {
        return mins.toFixed(1) + "m"
      }
    }
  }
}

export default ({
  currentTime = 0,
  duration,
  onChangeCurrentTime,
  keyframes
}) => {
  const [ref, bounds] = useMeasure()
  const [instantCurrentTime, changeInstantCurrentTime] = useState(currentTime)
  const [draggingTime, changeDraggingTime] = useRafState(false)

  useEffect(() => {
    if (currentTime !== instantCurrentTime) {
      changeInstantCurrentTime(currentTime)
    }
  }, [currentTime])

  const [minorInterval, majorInterval] = useMemo(
    () => getMajorInterval(duration),
    [duration]
  )

  const onMouseMove = useEventCallback(e => {
    if (draggingTime) {
      const px = (e.clientX - bounds.left) / bounds.width
      changeInstantCurrentTime(
        Math.min(duration, Math.max(0, Math.floor(px * duration)))
      )
    }
  })

  const onMouseUp = useEventCallback(e => {
    changeDraggingTime(false)
    const px = (e.clientX - bounds.left) / bounds.width
    const newTime = Math.min(duration, Math.max(0, Math.floor(px * duration)))
    changeInstantCurrentTime(newTime)
    onChangeCurrentTime(newTime)
  })

  // TODO skeleton
  if (!duration) return null

  return (
    <Container onMouseMove={onMouseMove} onMouseUp={onMouseUp} ref={ref}>
      {range(0, duration, majorInterval).map(a => (
        <>
          <Tick
            key={a}
            style={{ left: (a / duration) * bounds.width, height: "50%" }}
          />
          <TickText
            style={{
              left: (a / duration) * bounds.width + 8,
              bottom: "calc(50% - 12px)"
            }}
          >
            {getTimeString(a)}
          </TickText>
        </>
      ))}
      {range(0, duration, minorInterval)
        .filter(a => !Number.isInteger(a / majorInterval))
        .map(a => (
          <Tick
            key={a}
            style={{
              left: (a / duration) * bounds.width,
              height: "25%"
            }}
          />
        ))}
      <PositionCursor
        onMouseDown={e => changeDraggingTime(true)}
        style={{
          cursor: draggingTime ? "grabbing" : "grab",
          left: (instantCurrentTime / duration) * bounds.width
        }}
      >
        {getTimeString(instantCurrentTime)}
      </PositionCursor>
    </Container>
  )
}
