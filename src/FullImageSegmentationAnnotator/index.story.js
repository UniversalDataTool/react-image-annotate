// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import orange from "./orange.story.png"
import hard1 from "./hard1.story.jpg"
import hard2 from "./hard2.story.jpg"
import hard3 from "./hard3.story.jpg"

import FullImageSegmentationAnnotator from "./"

storiesOf("FullImageSegmentationAnnotator.Basic", module)
  .add("Orange 2 Class", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Seve's Desk",
            // src:
            //   "https://a.allegroimg.com/s128/113a6e/09d2c0ed4f278610e555c95b1d50/Rama-BIANCHI-OLTRE-XR4-DISC-carbon-Vision-ACR-51cm-Dedykowany-a-do-kolarstwo-szosowe",
            // src: "https://i.imgur.com/Dv5lkQZ.png",
            src: orange,
            regions: [
              [1, 40, 280],
              [1, 10, 10],
              [1, 240, 300],
            ]
              .map(([cls, y, x], i) => ({
                cls: ["fg", "bg"][cls],
                color: "hsl(162,100%,50%)",
                editingLabels: false,
                highlighted: false,
                id: "a" + i,
                type: "point",
                x: x / 320,
                y: y / 249,
              }))
              .concat([
                {
                  cls: "fg",
                  color: "hsl(162,100%,50%)",
                  editingLabels: false,
                  highlighted: false,
                  id: "bb",
                  type: "box",
                  x: 0.3,
                  y: 0.25,
                  w: 0.35,
                  h: 0.38,
                },
              ]),
          },
        ]}
        regionClsList={["bg", "fg"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("S3 CORS domain", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Seve's Desk",
            src: "https://s3.amazonaws.com/datasets.workaround.online/faces/010041.jpg",
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
        regionClsList={["bg", "fg"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("Orange 3 Class", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
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
        regionClsList={["bg", "orange", "hand"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("Hard 1, 8 Class, Simple Mode", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Hard",
            src: hard1,
          },
        ]}
        regionClsList={["bg", "1", "2", "3", "4", "5", "6", "7", "8"]}
        onExit={action("onExit")}
        autoSegmentationOptions={{ type: "simple" }}
      />
    </div>
  ))
  .add("Hard 1, 8 Class", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Hard",
            src: hard1,
          },
        ]}
        regionClsList={["1", "2", "3", "4", "5", "6", "7", "8"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("Hard 2, 8 Class", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Really Hard",
            src: hard2,
          },
        ]}
        regionClsList={["1", "2", "3", "4", "5", "6", "7", "8"]}
        onExit={action("onExit")}
      />
    </div>
  ))
  .add("Hard 3, 8 Class", () => (
    <div style={{ width: "95vw", height: "95vh" }}>
      <FullImageSegmentationAnnotator
        images={[
          {
            name: "Extremely Hard",
            src: hard3,
          },
        ]}
        regionClsList={["1", "2", "3", "4", "5", "6", "7", "8"]}
        onExit={action("onExit")}
      />
    </div>
  ))
