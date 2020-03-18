// @flow

import React, { useReducer } from "react"
import MainLayout from "../MainLayout"
import type {
  ToolEnum,
  Image,
  Mode,
  MainLayoutState,
  Action
} from "../MainLayout/types"
import SettingsProvider from "../SettingsProvider"

import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import imageReducer from "./reducers/image-reducer.js"
import videoReducer from "./reducers/video-reducer.js"

import makeImmutable from "seamless-immutable"

type Props = {
  taskDescription: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionTagList?: Array<string>,
  regionClsList?: Array<string>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  enabledTools?: Array<string>,
  showTags?: boolean,
  selectedImage?: string,
  images?: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  onExit: MainLayoutState => any,
  videoTime?: number,
  videoSrc?: string,
  keyframes?: Object,
  videoName?: string
}

export const Annotator = ({
  images,
  allowedArea,
  selectedImage = images && images.length > 0 ? images[0].src : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = true,
  enabledTools = ["select", "create-point", "create-box", "create-polygon"],
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  keyframes = {},
  taskDescription,
  videoSrc,
  videoTime = 0,
  videoName,
  onExit
}: Props) => {
  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'
  const annotationType = images ? "image" : "video"
  const [state, dispatchToReducer] = useReducer(
    combineReducers(
      annotationType === "image" ? imageReducer : videoReducer,
      generalReducer
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool: "select",
      mode: null,
      taskDescription,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      ...(annotationType === "image"
        ? {
            selectedImage,
            images,
            selectedImageFrameTime:
              images && images.length > 0 ? images[0].frameTime : undefined
          }
        : {
            videoSrc,
            keyframes
          })
    })
  )

  const dispatch = (action: Action) => {
    if (
      action.type === "HEADER_BUTTON_CLICKED" &&
      ["Exit", "Done", "Save", "Complete"].includes(action.buttonName)
    ) {
      onExit({ ...state, history: undefined })
    } else {
      dispatchToReducer(action)
    }
  }

  return (
    <SettingsProvider>
      <MainLayout state={state} dispatch={dispatch} />
    </SettingsProvider>
  )
}

export default Annotator
