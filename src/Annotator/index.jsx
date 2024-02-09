// @flow

import React, {useEffect, useReducer} from "react"
import makeImmutable, {without} from "seamless-immutable"

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
import noopReducer from "./reducers/noop-reducer.js"


export const Annotator = ({
  images,
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = getFromLocalStorage("showTags", true),
  enabledTools = [],
  selectedTool = "select",
  regionTagList = [],
  regionClsList = [],
  regionColorList = [],
  preselectCls = null,
  imageTagList = [],
  imageClsList = [],
  keyframes = {},
  taskDescription = "",
  RegionEditLabel,
  videoSrc,
  videoTime = 0,
  videoName,
  onExit,
  onNextImage,
  onPrevImage,
  keypointDefinitions,
  hideHeader,
  hideHeaderText,
  hideNext,
  hidePrev,
  hideClone,
  hideSettings,
  hideFullScreen,
  hideSave,
  enabledRegionProps = ["class", "name"],
  userReducer
}) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex((img) => img.src === selectedImage)
    if (selectedImage === -1) selectedImage = undefined
  }
  const annotationType = images ? "image" : "video"
  const [state, dispatchToReducer] = useReducer(
    historyHandler(
      combineReducers(
        annotationType === "image" ? imageReducer : videoReducer,
        generalReducer,
        userReducer === undefined ? noopReducer : userReducer
      )
    ),
    makeImmutable({
      annotationType,
      showTags,
      allowedArea,
      showPointDistances,
      pointDistancePrecision,
      selectedTool,
      mode: null,
      taskDescription,
      showMask: true,
      labelImages: imageClsList.length > 0 || imageTagList.length > 0,
      regionClsList,
      regionColorList,
      preselectCls,
      regionTagList,
      imageClsList,
      imageTagList,
      currentVideoTime: videoTime,
      enabledTools,
      history: [],
      videoName,
      keypointDefinitions,
      enabledRegionProps,
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

  const dispatch = useEventCallback((action) => {
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
        enabledRegionProps={enabledRegionProps}
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
  regionColorList: PropTypes.arrayOf(PropTypes.string),
  preselectCls: PropTypes.string,
  imageTagList: PropTypes.arrayOf(PropTypes.string),
  imageClsList: PropTypes.arrayOf(PropTypes.string),
  keyframes: PropTypes.object,
  taskDescription: PropTypes.string,
  RegionEditLabel: PropTypes.node,
  videoSrc: PropTypes.string,
  videoTime: PropTypes.number,
  videoName: PropTypes.string,
  onExit: PropTypes.func.isRequired,
  onNextImage: PropTypes.func,
  onPrevImage: PropTypes.func,
  keypointDefinitions: PropTypes.object,
  hideHeader: PropTypes.bool,
  hideHeaderText: PropTypes.bool,
  hideNext: PropTypes.bool,
  hidePrev: PropTypes.bool,
  hideClone: PropTypes.bool,
  hideSettings: PropTypes.bool,
  hideFullScreen: PropTypes.bool,
  hideSave: PropTypes.bool,
  enabledRegionProps: PropTypes.arrayOf(PropTypes.string),
  userReducer: PropTypes.func
}

export default Annotator
