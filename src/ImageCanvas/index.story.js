import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import ImageCanvas from "./"
import exampleMask from "./mouse_mask.story.png"
import exampleImage from "./seves_desk.story.jpg"
import dancingManImage from "./dancing-man.story.jpg"

export const testRegions = [
  {
    type: "point",
    id: "point1",
    cls: "Paper",
    highlighted: true,
    x: 0.8,
    y: 0.5,
    visible: true,
    color: "#f00",
  },
  {
    type: "point",
    id: "point2",
    cls: "Dude's Head",
    tags: ["human", "head", "male"],
    x: 0.1,
    y: 0.15,
    visible: true,
    color: "#0F0",
  },
  {
    type: "box",
    id: "box1",
    cls: "Business Card",
    highlighted: true,
    x: 0.315,
    y: 0.63,
    w: 0.067,
    h: 0.045,
    visible: true,
    color: "#ff0",
  },
  {
    type: "polygon",
    id: "polygon1",
    cls: "Laptop",
    tags: ["Electronic Device"],
    editingLabels: true,
    highlighted: true,
    points: [
      [0.4019, 0.5065],
      [0.407, 0.5895],
      [0.4157, 0.6801],
      [0.6579, 0.656],
      [0.6115, 0.5674],
      [0.5792, 0.4895],
    ],
    visible: true,
    color: "#f0f",
  },
  {
    type: "polygon",
    id: "polygon2",
    open: true,
    points: [
      [0.1201, 0.5987],
      [0.0674, 0.7063],
      [0.0726, 0.7477],
      [0.2132, 0.7311],
    ],
    visible: true,
    color: "#00f",
  },
  {
    type: "pixel",
    id: "pixel1",
    cls: "Mouse",
    tags: ["Electronic Device"],
    sx: 0.7433,
    sy: 0.5847,
    w: 0.83 - 0.7433,
    h: 0.67 - 0.5847,
    src: exampleMask,
    visible: true,
    color: "#00f",
  },
]

const events = {
  // Ignore common mouse movements, they fill the action log
  onMouseMove: () => null, //action("onMouseMove"),
  onMouseDown: () => null, //action("onMouseDown"),
  onMouseUp: () => null, //action("onMouseUp"),

  onChangeRegion: action("onChangeRegion"),
  onBeginRegionEdit: action("onBeginRegionEdit"),
  onCloseRegionEdit: action("onCloseRegionEdit"),

  onSelectRegion: action("onSelectRegion"),

  onBeginBoxTransform: action("onBeginBoxTransform"),

  onBeginMovePolygonPoint: action("onBeginMovePolygonPoint"),
  onAddPolygonPoint: action("onAddPolygonPoint"),
  onClosePolygon: action("onClosePolygon"),

  onBeginMoveKeypoint: action("onBeginMoveKeypoint"),

  onBeginMovePoint: action("onBeginMovePoint"),
  onDeleteRegion: action("onDeleteRegion"),
}

storiesOf("ImageCanvas", module)
  .add("Basic", () => (
    <ImageCanvas
      regions={testRegions}
      imageSrc={exampleImage}
      showTags
      {...events}
    />
  ))
  .add("Zoom Tool Selected", () => (
    <ImageCanvas
      showTags
      regions={testRegions}
      imageSrc={exampleImage}
      zoomWithPrimary
      {...events}
    />
  ))
  .add("Allowed Area", () => (
    <ImageCanvas
      showTags
      regions={[]}
      imageSrc={exampleImage}
      zoomWithPrimary
      allowedArea={{ x: 0.25, y: 0.25, w: 0.5, h: 0.5 }}
      {...events}
    />
  ))
  .add("Allowed Area (2)", () => (
    <ImageCanvas
      showTags
      regions={[]}
      imageSrc={exampleImage}
      zoomWithPrimary
      allowedArea={{ x: 0.6, y: 0.6, w: 0.2, h: 0.2 }}
      {...events}
    />
  ))
  .add("Modify Allowed Area", () => (
    <ImageCanvas
      showTags
      regions={[]}
      imageSrc={exampleImage}
      modifyingAllowedArea
      allowedArea={{ x: 0.6, y: 0.6, w: 0.2, h: 0.2 }}
      {...events}
    />
  ))
  .add("Poses", () => (
    <ImageCanvas
      keypointDefinitions={{
        human: {
          connections: [
            ["head", "sternum"],
            ["sternum", "leftElbow"],
            ["sternum", "rightElbow"],
          ],
          landmarks: {
            head: {
              label: "Head",
              color: "#f00",
              defaultPosition: [0, -0.05],
            },
            sternum: {
              label: "Torso",
              color: "#0f0",
              defaultPosition: [0, 0],
            },
            leftElbow: {
              label: "Left Elbow",
              color: "#00f",
              defaultPosition: [-0.05, 0],
            },
            rightElbow: {
              label: "Right Elbow",
              color: "#00f",
              defaultPosition: [0.05, 0],
            },
          },
        },
      }}
      regions={[
        {
          type: "keypoints",
          id: "keypoints1",
          keypointsDefinitionId: "human",
          highlighted: true,
          points: {
            head: { x: 0.54, y: 0.2 },
            sternum: { x: 0.57, y: 0.3 },
            leftElbow: { x: 0.4, y: 0.39 },
            rightElbow: { x: 0.7, y: 0.32 },
          },
          visible: true,
        },
      ]}
      imageSrc={dancingManImage}
      showTags
      {...events}
    />
  ))
