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
  box: memo(({ region, iw, ih }) => (
    <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
      <rect
        strokeWidth={2}
        x={0}
        y={0}
        width={region.w * iw}
        height={region.h * ih}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    </g>
  )),
  polygon: memo(({ region, iw, ih }) => {
    const Component = region.open ? "polyline" : "polygon"
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
    return (
      <polyline
        points={points
          .map(({ x, y }) => [x * iw, y * ih])
          .map((a) => a.join(" "))
          .join(" ")}
        strokeWidth={2}
        stroke={colorAlpha(region.color, 0.75)}
        fill={colorAlpha(region.color, 0.25)}
      />
    )
  }),
  pixel: () => null,
}

export const RegionShapes = ({ mat, imagePosition, regions = [] }) => {
  // for (const region of regions.filter(
  //   (r) => r.visible || r.visible === undefined
  // )) {
  //   switch (region.type) {
  //     case "box": {
  //       context.save()
  //
  //       context.shadowColor = "black"
  //       context.shadowBlur = 4
  //       context.strokeStyle = region.color
  //       context.strokeRect(
  //         region.x * iw,
  //         region.y * ih,
  //         region.w * iw,
  //         region.h * ih
  //       )
  //
  //       context.restore()
  //       break
  //     }
  //     case "polygon": {
  //       context.save()
  //
  //       context.shadowColor = "black"
  //       context.shadowBlur = 4
  //       context.strokeStyle = region.color
  //
  //       context.beginPath()
  //       context.moveTo(region.points[0][0] * iw, region.points[0][1] * ih)
  //       for (const point of region.points) {
  //         context.lineTo(point[0] * iw, point[1] * ih)
  //       }
  //       if (!region.open) context.closePath()
  //       context.stroke()
  //       context.restore()
  //       break
  //     }
  //     default:
  //       break
  //   }
  // }

  const iw = imagePosition.bottomRight.x - imagePosition.topLeft.x
  const ih = imagePosition.bottomRight.y - imagePosition.topLeft.y
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
      {regions
        .filter((r) => r.visible !== false)
        .map((r) => {
          const Component = RegionComponents[r.type]
          return <Component key={r.regionId} region={r} iw={iw} ih={ih} />
        })}
    </svg>
  )
}

export default RegionShapes
