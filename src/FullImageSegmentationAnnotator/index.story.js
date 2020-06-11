// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import orange from "./orange.story.png"

import FullImageSegmentationAnnotator from "./"

storiesOf("FullImageSegmentationAnnotator", module)
  .add("Orange 2 Class", () => (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Seve's Desk",
            // src:
            //   "https://a.allegroimg.com/s128/113a6e/09d2c0ed4f278610e555c95b1d50/Rama-BIANCHI-OLTRE-XR4-DISC-carbon-Vision-ACR-51cm-Dedykowany-a-do-kolarstwo-szosowe",
            // src: "https://i.imgur.com/Dv5lkQZ.png",
            src: orange,
            regions: [
              [0, 100, 125],
              [0, 100, 150],
              [1, 40, 280],
              [1, 10, 10],
              [1, 240, 300],
            ].map(([cls, y, x], i) => ({
              cls: ["fg", "bg"][cls],
              color: "hsl(162,100%,50%)",
              editingLabels: false,
              highlighted: false,
              id: "a" + i,
              type: "point",
              x: x / 320,
              y: y / 249,
            })),
          },
        ]}
        regionClsList={["fg", "bg"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("Orange 3 Class", () => (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Seve's Desk",
            src: orange,
            regions: [
              [0, 100, 125],
              [0, 100, 150],
              [1, 40, 280],
              [1, 10, 10],
              [1, 240, 300],
            ].map(([cls, y, x], i) => ({
              cls: ["orange", "bg", "hand"][cls],
              color: "hsl(162,100%,50%)",
              editingLabels: false,
              highlighted: false,
              id: "a" + i,
              type: "point",
              x: x / 320,
              y: y / 249,
            })),
          },
        ]}
        regionClsList={["orange", "bg", "hand"]}
        onExit={action("onExit")}
      />
    </div>
  ))
