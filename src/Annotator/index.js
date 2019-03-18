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
import reducer from "./reducer"

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
  onExit: MainLayoutState => any
}

export default ({
  images,
  allowedArea,
  selectedImage = images.length > 0 ? images[0].src : undefined,
  showTags = true,
  enabledTools = ["select", "create-point", "create-box", "create-polygon"],
  regionTagList = [],
  regionClsList = [],
  imageTagList = [],
  imageClsList = [],
  taskDescription,
  onExit
}: Props) => {
  const [state, dispatchToReducer] = useReducer(reducer, {
    showTags,
    allowedArea,
    selectedImage,
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
    if (
      action.type === "HEADER_BUTTON_CLICKED" &&
      (action.buttonName === "Exit" ||
        action.buttonName === "Done" ||
        action.buttonName === "Complete")
    ) {
      onExit({ ...state, history: undefined })
    } else {
      dispatchToReducer(action)
    }
  }

  return <MainLayout debug state={state} dispatch={dispatch} />
}
