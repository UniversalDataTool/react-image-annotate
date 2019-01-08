// @flow

import React from "react"
import { makeStyles } from "@material-ui/styles"
import TaskDescription from "../TaskDescriptionSidebarBox"
import ImageSelector from "../ImageSelectorSidebarBox"
// import RegionSelector from "../RegionSelector"
// import History from "../History"
import SidebarBoxContainer from "../SidebarBoxContainer"

const useStyles = makeStyles({})

export default () => {
  const classes = useStyles()

  return (
    <div>
      <TaskDescription />
      <ImageSelector
        images={[
          {
            src: "https://loremflickr.com/100/100/cars?lock=1",
            name: "Frame 0036"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=2",
            name: "Frame 0037"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=3",
            name: "Frame 0038"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=4",
            name: "Frame 0039"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=5",
            name: "Frame 0040"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=6",
            name: "Frame 0041"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=7",
            name: "Frame 0042"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=8",
            name: "Frame 0043"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=9",
            name: "Frame 0044"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=10",
            name: "Frame 0045"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=11",
            name: "Frame 0046"
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=12",
            name: "Frame 0047"
          }
        ]}
      />
    </div>
  )
}
