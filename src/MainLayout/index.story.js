// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { testRegions } from "../ImageCanvas/index.story"

import exampleImage from "../ImageCanvas/seves_desk.story.jpg"
import moment from "moment"

import MainLayout from "./"

storiesOf("MainLayout", module)
  .add("Basic", () => (
    <MainLayout
      state={{
        showTags: true,
        selectedImage: exampleImage,
        selectedTool: "select",
        taskDescription: "## Example Task Description\n\nPlease work hard.",
        labelImages: true,
        imageClsList: ["alpha image", "beta image", "charlie image"],
        imageTagList: ["tag1", "tag2", "tag3"],
        regionClsList: ["alpha region", "beta region", "charlie region"],
        regionTagList: ["tag1", "tag2", "tag3"],
        images: [
          {
            src: exampleImage,
            name: "Seve's Desk",
            regions: testRegions,
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=1",
            name: "Frame 0036",
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=2",
            name: "Frame 0037",
          },
          {
            src: "https://loremflickr.com/100/100/cars?lock=3",
            name: "Frame 0038",
          },
        ],
        mode: null,
        enabledTools: ["create-point", "create-polygon", "modify-allowed-area"],
        history: [{ name: "Reset Stuff", state: null, time: moment() }],
      }}
      dispatch={(a) => action(a.type)(a)}
    />
  ))
  .add("Completing a Polygon", () => (
    <MainLayout
      state={{
        showTags: false,
        selectedImage: exampleImage,
        selectedTool: "create-polygon",
        taskDescription: "",
        mode: {
          mode: "DRAW_POLYGON",
          regionId: "p1",
        },
        images: [
          {
            src: exampleImage,
            name: "Seve's Desk",
            regions: [
              {
                type: "polygon",
                points: [
                  [0.25, 0.25],
                  [0.25, 0.5],
                  [0.5, 0.5],
                ],
                highlighted: true,
                open: true,
                color: "#00f",
                id: "p1",
              },
            ],
          },
        ],
        enabledTools: [],
        history: [],
      }}
      dispatch={(a) => action(a.type)(a)}
    />
  ))
  .add("Region Overlap Clicking", () => (
    <MainLayout
      state={{
        showTags: false,
        selectedImage: exampleImage,
        selectedTool: "create-box",
        taskDescription: "",
        showTags: true,
        mode: {
          mode: "DRAW_POLYGON",
          regionId: "p1",
        },
        images: [
          {
            src: exampleImage,
            name: "Seve's Desk",
            regions: [
              {
                type: "box",
                cls: "Pants",
                x: 0.25,
                y: 0.25,
                w: 0.5,
                h: 0.5,
                color: "#00f",
                id: "p1",
              },
              {
                type: "box",
                cls: "Shirt",
                x: 0.8,
                y: 0.25,
                w: 0.1,
                h: 0.1,
                highlighted: true,
                color: "#00f",
                id: "p1",
              },
            ],
          },
        ],
        clsList: [],
        tagList: [],
        enabledTools: [],
        history: [],
      }}
      dispatch={(a) => !a.type.includes("MOUSE_MOVE") && action(a.type)(a)}
    />
  ))
  .add("Point Distances", () => (
    <MainLayout
      state={{
        showTags: false,
        showPointDistances: true,
        selectedImage: exampleImage,
        selectedTool: "create-point",
        taskDescription: "",
        showTags: true,
        mode: null,
        images: [
          {
            src: exampleImage,
            name: "Point Distance Check",
            regions: [
              {
                type: "point",
                cls: "P",
                x: 0.25,
                y: 0.25,
                color: "#f00",
                id: "p1",
              },
              {
                type: "point",
                cls: "P",
                x: 0.5,
                y: 0.25,
                color: "#0f0",
                id: "p2",
              },
              {
                type: "point",
                cls: "P",
                x: 0.5,
                y: 0.5,
                color: "#00f",
                id: "p3",
              },
            ],
          },
        ],
        clsList: [],
        tagList: [],
        enabledTools: [],
        history: [],
      }}
      dispatch={(a) => !a.type.includes("MOUSE_MOVE") && action(a.type)(a)}
    />
  ))
  .add("Point distances real units", () => (
    <MainLayout
      state={{
        showTags: false,
        showPointDistances: true,
        pointDistancePrecision: 2,
        selectedImage: exampleImage,
        selectedTool: "create-point",
        taskDescription: "",
        showTags: true,
        mode: null,
        images: [
          {
            src: exampleImage,
            name: "Point Distance Check",
            realSize: { w: 200, h: 1000, unitName: "cm" },
            regions: [
              {
                type: "point",
                cls: "P",
                x: 0.25,
                y: 0.25,
                color: "#f00",
                id: "p1",
              },
              {
                type: "point",
                cls: "P",
                x: 0.5,
                y: 0.25,
                color: "#0f0",
                id: "p2",
              },
              {
                type: "point",
                cls: "P",
                x: 0.5,
                y: 0.5,
                color: "#00f",
                id: "p3",
              },
            ],
          },
        ],
        clsList: [],
        tagList: [],
        enabledTools: [],
        history: [],
      }}
      dispatch={(a) => !a.type.includes("MOUSE_MOVE") && action(a.type)(a)}
    />
  ))
