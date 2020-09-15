// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import Annotator from "./"

storiesOf("Annotator(video)", module).add("Video Annotator", () => {
  const props = {
    regionClsList: ["valid", "invalid"],
    enabledTools: ["select", "create-box", "create-polygon", "create-point"],
    keyframes: {
      0: {
        regions: [
          {
            id: "910517662556203",
            cls: "valid",
            color: "#f44336",
            type: "box",
            x: 0.12195121951219515,
            y: 0.28726287262872624,
            w: 0.2606707317073171,
            h: 0.4769647696476965,
          },
        ],
      },
      2656: {
        regions: [
          {
            id: "910517662556203",
            cls: "valid",
            color: "#f44336",
            type: "box",
            x: 0.13109756097560976,
            y: 0.08672086720867206,
            w: 0.3445121951219512,
            h: 0.7913279132791328,
          },
        ],
      },
    },
    onExit: action("onExit"),
    taskDescription: "",
    videoName: "",
    videoTime: 0,
    videoSrc:
      "https://s3.amazonaws.com/asset.workaround.online/SampleVideo_1280x720_1mb.mp4",
  }
  return <Annotator {...props} />
})
