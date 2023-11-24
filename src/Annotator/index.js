// @flow

import type {
  Action,
  Image,
  MainLayoutState,
  Mode,
  ToolEnum,
} from "../MainLayout/types"
import React, { useEffect, useMemo, useReducer } from "react"
import makeImmutable, { without, setIn, getIn } from "seamless-immutable"

import type { KeypointsDefinition } from "../ImageCanvas/region-tools"
import MainLayout from "../MainLayout"
import type { Node } from "react"
import SettingsProvider from "../SettingsProvider"
import combineReducers from "./reducers/combine-reducers.js"
import generalReducer from "./reducers/general-reducer.js"
import getFromLocalStorage from "../utils/get-from-local-storage"
import historyHandler from "./reducers/history-handler.js"
import imageReducer from "./reducers/image-reducer.js"
import useEventCallback from "use-event-callback"
import videoReducer from "./reducers/video-reducer.js"
import { HotKeys } from "react-hotkeys"
import { defaultKeyMap } from "../ShortcutsManager"
import getActiveImage from "../Annotator/reducers/get-active-image"
import DeviceList from "../RegionLabel/DeviceList.js"

const getRandomId = () => Math.random().toString().split(".")[1]

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
  onSave: (MainLayoutState) => any,
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
    "show-mask",
    "create-scale",
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
  onSave,
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
  allowComments,
}: Props) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video"

  const uniqueBreakouts = new Set()
  if (images) {
    images.forEach((image) => {
      if (image.regions) {
        image.regions.forEach((region) => {
          if (region.breakout && region.breakout.is_breakout) {
            uniqueBreakouts.add(region.breakout)
          }
        })
      }
    })
  }

  // Converting Set back to an array before returning
  const breakouts = Array.from(uniqueBreakouts)

  const filters = {
    categories: [...new Set(DeviceList.map((item) => item.category))],
    breakoutNames: new Set(),
  }

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
      loadingTemplateMatching: false,
      toggleList: [],
      selectedBreakoutIdAutoAdd: null,
      breakouts: breakouts,
      filters: filters,
      excludedCategories: [],
      selectedBreakoutToggle: null,
      ...(annotationType === "image"
        ? {
            selectedImage,
            images,
            selectedImageFrameTime:
              images && images.length > 0 ? images[0].frameTime : undefined,
          }
        : {
            videoSrc,
            keyframes,
          }),
    })
  )

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      //if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
      if (["Exit", "Done", "Complete"].includes(action.buttonName)) {
        return onExit(without(state, "history"))
      } else if (action.buttonName === "Save") {
        return onSave(without(state, "history"))
      } else if (action.buttonName === "Next" && onNextImage) {
        dispatchToReducer({
          type: "ON_NEXT_OR_PREV_BREAKOUT_RESET",
        })
        return onNextImage(without(state, "history"))
      } else if (action.buttonName === "Prev" && onPrevImage) {
        dispatchToReducer({
          type: "ON_NEXT_OR_PREV_BREAKOUT_RESET",
        })
        return onPrevImage(without(state, "history"))
      }
    } else {
      dispatchToReducer(action)
    }
  })

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    })
  })

  useEffect(() => {
    if (selectedImage === undefined) return
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: selectedImage,
      image: state.images[selectedImage],
    })
  }, [selectedImage, state.images])

  if (!images && !videoSrc)
    return 'Missing required prop "images" or "videoSrc"'

  return (
    <HotKeys keyMap={defaultKeyMap}>
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
    </HotKeys>
  )
}

export default Annotator
