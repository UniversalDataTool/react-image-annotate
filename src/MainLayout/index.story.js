// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { testRegions } from "../ImageCanvas/index.story"

import exampleImage from "../ImageCanvas/seves_desk.story.jpg"

import MainLayout from "./"

storiesOf("MainLayout", module).add("Basic", () => (
  <MainLayout
    state={{
      showTags: true,
      selectedImage: exampleImage,
      selectedTool: "select",
      taskDescription: "## Example Task Description\n\nPlease work hard.",
      images: [
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
      ],
      clsList: [],
      tagList: [],
      enabledTools: [],
      history: []
    }}
    dispatch={action("dispatch")}
  />
))
