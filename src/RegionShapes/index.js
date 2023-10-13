// @flow

import React, { memo } from "react"
import colorAlpha from "color-alpha"

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num
}

const RegionComponents = {
  point: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
      <path
        d={"M0 8L8 0L0 -8L-8 0Z"}
        strokeWidth={2}
        stroke={region.color}
        fill="transparent"
      />
    </g>
  )),
  line: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x1 * iw} ${region.y1 * ih})`}>
      <line
        strokeWidth={2}
        x1={0}
        y1={0}
        x2={(region.x2 - region.x1) * iw}
        y2={(region.y2 - region.y1) * ih}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    </g>
  )),
  box: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
      <rect
        strokeWidth={2}
        x={0}
        y={0}
        width={Math.max(region.w * iw, 0)}
        height={Math.max(region.h * ih, 0)}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    </g>
  )),
  polygon: memo(({ region, iw, ih, fullSegmentationMode }) => {
    const Component = region.open ? "polyline" : "polygon"
    const alphaBase = fullSegmentationMode ? 0.5 : 1
    return (
      <Component
        points={region.points
          .map(([x, y]) => [x * iw, y * ih])
          .map((a) => a.join(" "))
          .join(" ")}
        strokeWidth={2}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    )
  }),
  keypoints: ({ region, iw, ih, keypointDefinitions }) => {
    const { points, keypointsDefinitionId } = region
    if (!keypointDefinitions[keypointsDefinitionId]) {
      throw new Error(
        `No definition for keypoint configuration "${keypointsDefinitionId}"`
      )
    }
    const { landmarks, connections } =
      keypointDefinitions[keypointsDefinitionId]
    return (
      <g>
        {Object.entries(points).map(([keypointId, { x, y }], i) => (
          <g key={i} transform={`translate(${x * iw} ${y * ih})`}>
            <path
              d={"M0 8L8 0L0 -8L-8 0Z"}
              strokeWidth={2}
              stroke={landmarks[keypointId].color}
              fill="transparent"
            />
          </g>
        ))}
        {connections.map(([kp1Id, kp2Id]) => {
          const kp1 = points[kp1Id]
          const kp2 = points[kp2Id]
          const midPoint = { x: (kp1.x + kp2.x) / 2, y: (kp1.y + kp2.y) / 2 }

          return (
            <g key={`${kp1.x},${kp1.y}.${kp2.x},${kp2.y}`}>
              <line
                x1={kp1.x * iw}
                y1={kp1.y * ih}
                x2={midPoint.x * iw}
                y2={midPoint.y * ih}
                strokeWidth={2}
                stroke={landmarks[kp1Id].color}
              />
              <line
                x1={kp2.x * iw}
                y1={kp2.y * ih}
                x2={midPoint.x * iw}
                y2={midPoint.y * ih}
                strokeWidth={2}
                stroke={landmarks[kp2Id].color}
              />
            </g>
          )
        })}
      </g>
    )
  },
  "expanding-line": memo(({ region, iw, ih }) => {
    let { expandingWidth = 0.005, points } = region
    expandingWidth = points.slice(-1)[0].width || expandingWidth
    const pointPairs = points.map(({ x, y, angle, width }, i) => {
      if (!angle) {
        const n = points[clamp(i + 1, 0, points.length - 1)]
        const p = points[clamp(i - 1, 0, points.length - 1)]
        angle = Math.atan2(p.x - n.x, p.y - n.y) + Math.PI / 2
      }
      const dx = (Math.sin(angle) * (width || expandingWidth)) / 2
      const dy = (Math.cos(angle) * (width || expandingWidth)) / 2
      return [
        { x: x + dx, y: y + dy },
        { x: x - dx, y: y - dy },
      ]
    })
    const firstSection = pointPairs.map(([p1, p2]) => p1)
    const secondSection = pointPairs.map(([p1, p2]) => p2).asMutable()
    secondSection.reverse()
    const lastPoint = points.slice(-1)[0]
    return (
      <>
        <polygon
          points={firstSection
            .concat(region.candidatePoint ? [region.candidatePoint] : [])
            .concat(secondSection)
            .map((p) => `${p.x * iw} ${p.y * ih}`)
            .join(" ")}
          strokeWidth={2}
          stroke={colorAlpha(region.color, 0.75)}
          fill={colorAlpha(region.color, 0.25)}
        />
        {points.map(({ x, y, angle }, i) => (
          <g
            key={i}
            transform={`translate(${x * iw} ${y * ih}) rotate(${
              (-(angle || 0) * 180) / Math.PI
            })`}
          >
            <g>
              <rect
                x={-5}
                y={-5}
                width={10}
                height={10}
                strokeWidth={2}
                stroke={colorAlpha(region.color, 0.75)}
                fill={colorAlpha(region.color, 0.25)}
              />
            </g>
          </g>
        ))}
        <rect
          x={lastPoint.x * iw - 8}
          y={lastPoint.y * ih - 8}
          width={16}
          height={16}
          strokeWidth={4}
          stroke={colorAlpha(region.color, 0.5)}
          fill={"transparent"}
        />
      </>
    )
  }),
  pixel: () => null,
}

export const WrappedRegionList = memo(
  ({ regions, keypointDefinitions, iw, ih, fullSegmentationMode }) => {
    return regions
      .filter((r) => r.visible !== false)
      .map((r) => {
        const Component = RegionComponents[r.type]
        return (
          <Component
            key={r.regionId}
            region={r}
            iw={iw}
            ih={ih}
            keypointDefinitions={keypointDefinitions}
            fullSegmentationMode={fullSegmentationMode}
          />
        )
      })
  },
  (n, p) => n.regions === p.regions && n.iw === p.iw && n.ih === p.ih
)

export const RegionShapes = ({
  mat,
  imagePosition,
  regions = [],
  keypointDefinitions,
  fullSegmentationMode,
}) => {
  const iw = imagePosition.bottomRight.x - imagePosition.topLeft.x
  const ih = imagePosition.bottomRight.y - imagePosition.topLeft.y
  if (isNaN(iw) || isNaN(ih)) return null
  return (
    <svg
      width={iw}
      height={ih}
      style={{
        position: "absolute",
        zIndex: 2,
        left: imagePosition.topLeft.x,
        top: imagePosition.topLeft.y,
        pointerEvents: "none",
        width: iw,
        height: ih,
      }}
    >
      <WrappedRegionList
        key="wrapped-region-list"
        regions={regions}
        iw={iw}
        ih={ih}
        keypointDefinitions={keypointDefinitions}
        fullSegmentationMode={fullSegmentationMode}
      />
    </svg>
  )
}

export default RegionShapes
