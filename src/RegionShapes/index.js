// @flow

import React, { memo } from "react"

const RegionComponents = {
  point: memo(
    ({ region, iw, ih }) => (
      console.log("point rendering"),
      (
        <g transform={`translate(${region.x * iw} ${region.y * ih})`}>
          <path
            d={"M0 8L8 0L0 -8L-8 0Z"}
            strokeWidth={2}
            stroke={region.color}
            fill="transparent"
          />
        </g>
      )
    )
  ),
  box: () => null,
  polygon: () => null,
  "expanding-line": () => null,
  pixel: () => null,
}

export const RegionShapes = ({ mat, imagePosition, regions = [] }) => {
  // for (const region of regions.filter(
  //   (r) => r.visible || r.visible === undefined
  // )) {
  //   switch (region.type) {
  //     case "point": {
  //       if (!fullImageSegmentationMode) {
  //         context.save()
  //
  //         context.beginPath()
  //         context.strokeStyle = region.color
  //         context.moveTo(region.x * iw - 10, region.y * ih)
  //         context.lineTo(region.x * iw - 2, region.y * ih)
  //         context.moveTo(region.x * iw + 10, region.y * ih)
  //         context.lineTo(region.x * iw + 2, region.y * ih)
  //         context.moveTo(region.x * iw, region.y * ih - 10)
  //         context.lineTo(region.x * iw, region.y * ih - 2)
  //         context.moveTo(region.x * iw, region.y * ih + 10)
  //         context.lineTo(region.x * iw, region.y * ih + 2)
  //         context.moveTo(region.x * iw + 5, region.y * ih)
  //         context.arc(region.x * iw, region.y * ih, 5, 0, 2 * Math.PI)
  //         context.stroke()
  //         context.restore()
  //       } else {
  //         const length = 4
  //         context.save()
  //
  //         context.beginPath()
  //         context.strokeStyle = region.color
  //
  //         context.moveTo(region.x * iw, region.y * ih + length)
  //         context.lineTo(region.x * iw + length, region.y * ih)
  //         context.moveTo(region.x * iw, region.y * ih - length)
  //         context.lineTo(region.x * iw + length, region.y * ih)
  //         context.moveTo(region.x * iw, region.y * ih - length)
  //         context.lineTo(region.x * iw - length, region.y * ih)
  //         context.moveTo(region.x * iw, region.y * ih + length)
  //         context.lineTo(region.x * iw - length, region.y * ih)
  //         context.stroke()
  //         context.restore()
  //       }
  //       break
  //     }
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
      {regions.map((r) => {
        const Component = RegionComponents[r.type]
        return <Component key={r.regionId} region={r} iw={iw} ih={ih} />
      })}
    </svg>
  )
}

export default RegionShapes
