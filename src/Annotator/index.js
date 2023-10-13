// @flow

import type { Action, Image, MainLayoutState } from "../MainLayout/types"
import type { Node } from "react"
import React, { useEffect, useReducer } from "react"
import makeImmutable, { without } from "seamless-immutable"

import type { KeypointsDefinition } from "../ImageCanvas/region-tools"
import MainLayout from "../MainLayout"
import SettingsProvider from "../SettingsProvider"
import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import getFromLocalStorage from "../utils/get-from-local-storage"
import historyHandler from "./reducers/history-handler.js"
import imageReducer from "./reducers/image-reducer.js"
import useEventCallback from "use-event-callback"
import videoReducer from "./reducers/video-reducer.js"
import PropTypes from "prop-types"

type Props = {
  taskDescription?: string,
  allowedArea?: { x: number, y: number, w: number, h: number },
  regionTagList?: Array<string>,
  regionClsList?: Array<string>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  enabledTools?: Array<string>,
  selectedTool?: String,
  showTags?: boolean,
  selectedImage?: string | number,
  images?: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  RegionEditLabel?: Node,
  onExit: (MainLayoutState) => any,
  videoTime?: number,
  videoSrc?: string,
  keyframes?: Object,
  videoName?: string,
  keypointDefinitions: KeypointsDefinition,
  fullImageSegmentationMode?: boolean,
  autoSegmentationOptions?:
    | {| type: "simple" |}
    | {| type: "autoseg", maxClusters?: number, slicWeightFactor?: number |},
  hideHeader?: boolean,
  hideHeaderText?: boolean,
  hideNext?: boolean,
  hidePrev?: boolean,
  hideClone?: boolean,
  hideSettings?: boolean,
  hideFullScreen?: boolean,
  hideSave?: boolean,
}

export const Annotator = ({
                            images,
                            allowedArea,
                            selectedImage = images && images.length > 0 ? 0 : undefined,
                            showPointDistances,
                            pointDistancePrecision,
                            showTags = getFromLocalStorage("showTags", true),
                            enabledTools = [
                              "select",
                              "create-point",
                              "create-box",
                              "create-polygon",
                              "create-line",
                              "create-expanding-line",
                              "show-mask"
                            ],
                            selectedTool = "select",
                            regionTagList = [],
                            regionClsList = [],
                            imageTagList = [],
                            imageClsList = [],
                            keyframes = {},
                            taskDescription = "",
                            fullImageSegmentationMode = false,
                            RegionEditLabel,
                            videoSrc,
                            videoTime = 0,
                            videoName,
                            onExit,
                            onNextImage,
                            onPrevImage,
                            keypointDefinitions,
                            autoSegmentationOptions = { type: "autoseg" },
                            hideHeader,
                            hideHeaderText,
                            hideNext,
                            hidePrev,
                            hideClone,
                            hideSettings,
                            hideFullScreen,
                            hideSave,
                            allowComments
                          }: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video"
  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      fullImageSegmentationMode: fullImageSegmentationMode,
      autoSegmentationOptions,
      mode: null,
      taskDescription,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      keypointDefinitions,
      allowComments,
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

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"))
      } else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(without(state, "history"))
      } else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(without(state, "history"))
      }
    }
    dispatchToReducer(action)
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage]
    })
  }, [selectedImage, state.images])

  if (!images && !videoSrc)
    return "Missing required prop \"images\" or \"videoSrc\""

  return (
    <SettingsProvider>
      <MainLayout
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
        hideHeader={hideHeader}
        hideHeaderText={hideHeaderText}
        hideNext={hideNext}
        hidePrev={hidePrev}
        hideClone={hideClone}
        hideSettings={hideSettings}
        hideFullScreen={hideFullScreen}
        hideSave={hideSave}
      />
    </SettingsProvider>
  )
}

Annotator.propTypes = {
  images: PropTypes.array,
  allowedArea: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired
  }),
  selectedImage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  showPointDistances: PropTypes.bool,
  pointDistancePrecision: PropTypes.number,
  showTags: PropTypes.bool,
  enabledTools: PropTypes.arrayOf(PropTypes.string),
  selectedTool: PropTypes.string,
  regionTagList: PropTypes.arrayOf(PropTypes.string),
  regionClsList: PropTypes.arrayOf(PropTypes.string),
  imageTagList: PropTypes.arrayOf(PropTypes.string),
  imageClsList: PropTypes.arrayOf(PropTypes.string),
  keyframes: PropTypes.object,
  taskDescription: PropTypes.string,
  fullImageSegmentationMode: PropTypes.bool,
  RegionEditLabel: PropTypes.node,
  videoSrc: PropTypes.string,
  videoTime: PropTypes.number,
  videoName: PropTypes.string,
  onExit: PropTypes.func.isRequired,
  onNextImage: PropTypes.func,
  onPrevImage: PropTypes.func,
  keypointDefinitions: PropTypes.object,
  autoSegmentationOptions: PropTypes.object,
  hideHeader: PropTypes.bool,
  hideHeaderText: PropTypes.bool,
  hideNext: PropTypes.bool,
  hidePrev: PropTypes.bool,
  hideClone: PropTypes.bool,
  hideSettings: PropTypes.bool,
  hideFullScreen: PropTypes.bool,
  hideSave: PropTypes.bool,
  allowComments: PropTypes.bool
}

export default Annotator
