// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import exampleImage from "../ImageCanvas/seves_desk.story.jpg"

import FullImageSegmentationAnnotator from "./"

storiesOf("FullImageSegmentationAnnotator", module).add("Basic", () => (
  <div style={{ width: "100vw", height: "100vh" }}>
    <FullImageSegmentationAnnotator
      images={[
        {
          name: "Seve's Desk",
          src: exampleImage,
        },
      ]}
      onExit={action("onExit")}
    />
  </div>
))
