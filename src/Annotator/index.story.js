// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import exampleImage from "../ImageCanvas/seves_desk.story.jpg"

import Annotator from "./"

import { testRegions } from "../ImageCanvas/index.story"

storiesOf("Annotator", module).add("Basic", () => (
  <Annotator
    images={[
      {
        src: exampleImage,
        name: "Seve's Desk",
        regions: testRegions
      },
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
      }
    ]}
  />
))
