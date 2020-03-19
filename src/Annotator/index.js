// @flow

import React, { useReducer, useEffect } from "react"
import MainLayout from "../MainLayout"
import type {
  ToolEnum,
  Image,
  Mode,
  MainLayoutState,
  Action
} from "../MainLayout/types"
import SettingsProvider from "../SettingsProvider"
import reducer from "./reducer"
import { useKey, useLocalStorage } from 'react-use';

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
  images: Array<Image>,
  showPointDistances?: boolean,
  pointDistancePrecision?: number,
  onExit: MainLayoutState => any
}

export default ({
  images,
  allowedArea,
  selectedImage = images.length > 0 ? images[0].src : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = true,
  enabledTools = ["select", "create-point", "create-box", "create-polygon"],
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  taskDescription,
  onExit,
  onNextImage,
  onPrevImage
}: Props) => {
  const [state, dispatchToReducer] = useReducer(reducer, {
    showTags,
    allowedArea,
    selectedImage,
    showPointDistances,
    pointDistancePrecision,
    selectedTool: "select",
    mode: null,
    taskDescription,
    images,
    labelImages: imageClsList.length > 0 || imageTagList.length > 0,
    regionClsList,
    regionTagList,
    imageClsList,
    imageTagList,
    enabledTools,
    history: []
  })

  const dispatch = (action: Action) => {
    if (!action.type.includes("MOUSE_"))
    switch (action.type) {
      case "HEADER_BUTTON_CLICKED":
        if (
          (
            action.buttonName === "Exit" ||
            action.buttonName === "Done" ||
            action.buttonName === "Save" ||
            action.buttonName === "Complete")
        ) {
          onExit({ ...state, history: undefined })
          return
        }
        if (action.buttonName === "Next" && onNextImage) {
          return onNextImage({...state, history: undefined})
        }
        if (action.buttonName === "Prev" && onPrevImage) {
          return onPrevImage({...state, history: undefined})
        }
      default:
        dispatchToReducer(action)
    }
  }

  useKey('ArrowRight', (event) =>{
    // if selected tool === none
    event.preventDefault()
    event.stopPropagation()
    if (onNextImage) {
      onNextImage({ ...state, history: undefined })
    }else{
      const nextImageIndex = (state.images.findIndex(img => img.src === state.selectedImage) + 1) % state.images.length
      const nextImage  = state.images[nextImageIndex]
      dispatchToReducer({ type: 'SELECT_IMAGE', image: nextImage })
    }
  })

  useKey('ArrowLeft', (event) =>{
    event.preventDefault()
    event.stopPropagation()
    if (onPrevImage){
      onPrevImage({ ...state, history: undefined })
    }else{
      const prevImageIndex = (state.images.findIndex(img => img.src === state.selectedImage) - 1 + state.images.length) % state.images.length
      const prevImage  = state.images[prevImageIndex]
      dispatchToReducer({ type: 'SELECT_IMAGE', image: prevImage })
    }
  })

  useEffect(() => {
    dispatchToReducer({ type: "SELECT_IMAGE", image: state.images.find(img => img.src === selectedImage) })
  }, [selectedImage])

  return (
    <SettingsProvider>
      <MainLayout
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        dispatch={dispatch}
      />
    </SettingsProvider>
  )
}
