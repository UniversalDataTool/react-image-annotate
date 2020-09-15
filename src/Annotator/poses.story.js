// @flow

import React, { useState } from "react"

import { storiesOf } from "@storybook/react"
import { action as actionAddon } from "@storybook/addon-actions"
import dancingManImage from "../ImageCanvas/dancing-man.story.jpg"
import Annotator from "./"

const middlewares = [
  (store) => (next) => (action) => {
    actionAddon(action.type)(action)
    return next(action)
  },
]

storiesOf("Annotator (Poses)", module).add("Basic", () => (
  <Annotator
    onExit={actionAddon("onExit")}
    middlewares={middlewares}
    labelImages
    enabledTools={["create-keypoints"]}
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
    images={[
      {
        src: dancingManImage,
        name: "Dancing Man",
        regions: [
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
        ],
      },
    ]}
  />
))
