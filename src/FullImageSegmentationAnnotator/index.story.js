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
          src: "https://a.allegroimg.com/s128/113a6e/09d2c0ed4f278610e555c95b1d50/Rama-BIANCHI-OLTRE-XR4-DISC-carbon-Vision-ACR-51cm-Dedykowany-a-do-kolarstwo-szosowe",
        },
      ]}
      onExit={action("onExit")}
    />
  </div>
))
