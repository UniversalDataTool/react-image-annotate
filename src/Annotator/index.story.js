// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action as actionAddon } from "@storybook/addon-actions"
import exampleImage from "../ImageCanvas/seves_desk.story.jpg"

import Annotator from "./"

import { testRegions } from "../ImageCanvas/index.story"

storiesOf("Annotator", module)
  .add("Basic", () => (
    <Annotator
      onExit={actionAddon("onExit")}
      middlewares={[
        store => next => action => {
          actionAddon(action.type)(action)
          return next(action)
        }
      ]}
      labelImages
      regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
      regionTagList={["tag1", "tag2", "tag3"]}
      imageClsList={["Alpha", "Beta", "Charlie", "Delta"]}
      imageTagList={["tag1", "tag2", "tag3"]}
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
  .add("Shrunk Annotator (Test Fullscreen)", () => (
    <div style={{ padding: 100 }}>
      <Annotator
        onExit={actionAddon("onExit")}
        regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
        regionTagList={["tag1", "tag2", "tag3"]}
        middlewares={[
          store => next => action => {
            actionAddon(action.type)(action)
            return next(action)
          }
        ]}
        images={[
          {
            src: exampleImage,
            name: "Seve's Desk",
            regions: testRegions
          }
        ]}
      />
    </div>
  ))
  .add("Annotator w/o No Region Labels or Image Labels", () => (
    <Annotator
      onExit={actionAddon("onExit")}
      middlewares={[
        store => next => action => {
          actionAddon(action.type)(action)
          return next(action)
        }
      ]}
      images={[
        {
          src: exampleImage,
          name: "Seve's Desk",
          regions: testRegions
        }
      ]}
    />
  ))
  .add("Annotator with no enabled tools", () => (
    <Annotator
      onExit={actionAddon("onExit")}
      enabledTools={[]}
      showTags={false}
      middlewares={[
        store => next => action => {
          actionAddon(action.type)(action)
          return next(action)
        }
      ]}
      images={[
        {
          src: exampleImage,
          name: "Seve's Desk",
          regions: testRegions
        }
      ]}
    />
  ))
  .add("Bounding Box Annotator with output to console.log", () => (
    <Annotator
      onExit={out => {
        window.lastOutput = out
        console.log(out)
      }}
      enabledTools={["select", "create-box"]}
      showTags={false}
      images={[
        {
          src:
            "https://s3.amazonaws.com/jobstorage.workaround.online/Atheer/video-frames/VID_20190111_161054.mp4_frame017.png",
          name: "Bounding Box Test",
          regions: []
        }
      ]}
    />
  ))
