// @flow weak

import React, { Fragment } from "react"
import { styled } from "@mui/material/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme()
const Svg = styled("svg")(({ theme }) => ({
  pointerEvents: "none",
  position: "absolute",
  zIndex: 1,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  "& text": {
    fill: "#fff",
  },
  "& path": {
    vectorEffect: "non-scaling-stroke",
    strokeWidth: 2,
    opacity: 0.5,
    stroke: "#FFF",
    fill: "none",
    strokeDasharray: 5,
    animationDuration: "4s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: "running",
  },
}))

export const PointDistances = ({
  projectRegionBox,
  regions,
  pointDistancePrecision,
  realSize,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <Svg>
        {regions
          .filter((r1) => r1.type === "point")
          .flatMap((r1, i1) =>
            regions
              .filter((r2, i2) => i2 > i1)
              .filter((r2) => r2.type === "point")
              .map((r2) => {
                const pr1 = projectRegionBox(r1)
                const pr2 = projectRegionBox(r2)
                const prm = {
                  x: (pr1.x + pr1.w / 2 + pr2.x + pr2.w / 2) / 2,
                  y: (pr1.y + pr1.h / 2 + pr2.y + pr2.h / 2) / 2,
                }
                let displayDistance
                if (realSize) {
                  const { w, h, unitName } = realSize
                  displayDistance =
                    Math.sqrt(
                      Math.pow(r1.x * w - r2.x * w, 2) +
                        Math.pow(r1.y * h - r2.y * h, 2)
                    ).toFixed(pointDistancePrecision) + unitName
                } else {
                  displayDistance =
                    (
                      Math.sqrt(
                        Math.pow(r1.x - r2.x, 2) + Math.pow(r1.y - r2.y, 2)
                      ) * 100
                    ).toFixed(pointDistancePrecision) + "%"
                }
                return (
                  <Fragment>
                    <path
                      d={`M${pr1.x + pr1.w / 2},${pr1.y + pr1.h / 2} L${
                        pr2.x + pr2.w / 2
                      },${pr2.y + pr2.h / 2}`}
                    />
                    <text x={prm.x} y={prm.y}>
                      {displayDistance}
                    </text>
                  </Fragment>
                )
              })
          )}
      </Svg>
    </ThemeProvider>
  )
}

export default PointDistances
