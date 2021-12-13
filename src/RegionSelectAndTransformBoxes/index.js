import React, { Fragment, memo } from "react"
import HighlightBox from "../HighlightBox"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import PreventScrollToParents from "../PreventScrollToParents"
import Tooltip from "@mui/material/Tooltip"

const theme = createTheme()
const TransformGrabber = styled("div")(({ theme }) => ({
  width: 8,
  height: 8,
  zIndex: 2,
  border: "2px solid #FFF",
  position: "absolute",
}))

const boxCursorMap = [
  ["nw-resize", "n-resize", "ne-resize"],
  ["w-resize", "grab", "e-resize"],
  ["sw-resize", "s-resize", "se-resize"],
]

const arePropsEqual = (prev, next) => {
  return (
    prev.region === next.region &&
    prev.dragWithPrimary === next.dragWithPrimary &&
    prev.createWithPrimary === next.createWithPrimary &&
    prev.zoomWithPrimary === next.zoomWithPrimary &&
    prev.mat === next.mat
  )
}

export const RegionSelectAndTransformBox = memo(
  ({
    region: r,
    mouseEvents,
    projectRegionBox,
    dragWithPrimary,
    createWithPrimary,
    zoomWithPrimary,
    onBeginMovePoint,
    onSelectRegion,
    layoutParams,
    fullImageSegmentationMode = false,
    mat,
    onBeginBoxTransform,
    onBeginMovePolygonPoint,
    onBeginMoveKeypoint,
    onAddPolygonPoint,
    showHighlightBox,
  }) => {
    const pbox = projectRegionBox(r)
    const { iw, ih } = layoutParams.current
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <PreventScrollToParents>
            {showHighlightBox && r.type !== "polygon" && (
              <HighlightBox
                region={r}
                mouseEvents={mouseEvents}
                dragWithPrimary={dragWithPrimary}
                createWithPrimary={createWithPrimary}
                zoomWithPrimary={zoomWithPrimary}
                onBeginMovePoint={onBeginMovePoint}
                onSelectRegion={onSelectRegion}
                pbox={pbox}
              />
            )}
            {r.type === "box" &&
              !dragWithPrimary &&
              !zoomWithPrimary &&
              !r.locked &&
              r.highlighted &&
              mat.a < 1.2 &&
              [
                [0, 0],
                [0.5, 0],
                [1, 0],
                [1, 0.5],
                [1, 1],
                [0.5, 1],
                [0, 1],
                [0, 0.5],
                [0.5, 0.5],
              ].map(([px, py], i) => (
                <TransformGrabber
                  key={i}
                  {...mouseEvents}
                  onMouseDown={(e) => {
                    if (e.button === 0)
                      return onBeginBoxTransform(r, [px * 2 - 1, py * 2 - 1])
                    mouseEvents.onMouseDown(e)
                  }}
                  style={{
                    left: pbox.x - 4 - 2 + pbox.w * px,
                    top: pbox.y - 4 - 2 + pbox.h * py,
                    cursor: boxCursorMap[py * 2][px * 2],
                    borderRadius: px === 0.5 && py === 0.5 ? 4 : undefined,
                  }}
                />
              ))}
            {r.type === "polygon" &&
              !dragWithPrimary &&
              !zoomWithPrimary &&
              !r.locked &&
              r.highlighted &&
              r.points.map(([px, py], i) => {
                const proj = mat
                  .clone()
                  .inverse()
                  .applyToPoint(px * iw, py * ih)
                return (
                  <TransformGrabber
                    key={i}
                    {...mouseEvents}
                    onMouseDown={(e) => {
                      if (e.button === 0 && (!r.open || i === 0))
                        return onBeginMovePolygonPoint(r, i)
                      mouseEvents.onMouseDown(e)
                    }}
                    style={{
                      cursor: !r.open
                        ? "move"
                        : i === 0
                        ? "pointer"
                        : undefined,
                      zIndex: 10,
                      pointerEvents:
                        r.open && i === r.points.length - 1
                          ? "none"
                          : undefined,
                      left: proj.x - 4,
                      top: proj.y - 4,
                    }}
                  />
                )
              })}
            {r.type === "polygon" &&
              r.highlighted &&
              !dragWithPrimary &&
              !zoomWithPrimary &&
              !r.locked &&
              !r.open &&
              r.points.length > 1 &&
              r.points
                .map((p1, i) => [p1, r.points[(i + 1) % r.points.length]])
                .map(([p1, p2]) => [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2])
                .map((pa, i) => {
                  const proj = mat
                    .clone()
                    .inverse()
                    .applyToPoint(pa[0] * iw, pa[1] * ih)
                  return (
                    <TransformGrabber
                      key={i}
                      {...mouseEvents}
                      onMouseDown={(e) => {
                        if (e.button === 0)
                          return onAddPolygonPoint(r, pa, i + 1)
                        mouseEvents.onMouseDown(e)
                      }}
                      style={{
                        cursor: "copy",
                        zIndex: 10,
                        left: proj.x - 4,
                        top: proj.y - 4,
                        border: "2px dotted #fff",
                        opacity: 0.5,
                      }}
                    />
                  )
                })}
            {r.type === "keypoints" &&
              !dragWithPrimary &&
              !zoomWithPrimary &&
              !r.locked &&
              r.highlighted &&
              Object.entries(r.points).map(
                ([keypointId, { x: px, y: py }], i) => {
                  const proj = mat
                    .clone()
                    .inverse()
                    .applyToPoint(px * iw, py * ih)
                  return (
                    <Tooltip title={keypointId} key={i}>
                      <TransformGrabber
                        key={i}
                        {...mouseEvents}
                        onMouseDown={(e) => {
                          if (e.button === 0 && (!r.open || i === 0))
                            return onBeginMoveKeypoint(r, keypointId)
                          mouseEvents.onMouseDown(e)
                        }}
                        style={{
                          cursor: !r.open
                            ? "move"
                            : i === 0
                            ? "pointer"
                            : undefined,
                          zIndex: 10,
                          pointerEvents:
                            r.open && i === r.points.length - 1
                              ? "none"
                              : undefined,
                          left: proj.x - 4,
                          top: proj.y - 4,
                        }}
                      />
                    </Tooltip>
                  )
                }
              )}
          </PreventScrollToParents>
        </Fragment>
      </ThemeProvider>
    )
  },
  arePropsEqual
)

export const RegionSelectAndTransformBoxes = memo(
  (props) => {
    return props.regions
      .filter((r) => r.visible || r.visible === undefined)
      .filter((r) => !r.locked)
      .map((r, i) => {
        return <RegionSelectAndTransformBox key={r.id} {...props} region={r} />
      })
  },
  (n, p) => n.regions === p.regions && n.mat === p.mat
)

export default RegionSelectAndTransformBoxes
