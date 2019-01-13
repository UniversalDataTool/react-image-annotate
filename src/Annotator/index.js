// @flow

import React, { useReducer } from "react"
import MainLayout from "../MainLayout"
import type { ToolEnum, Image, Mode } from "../MainLayout/types"
import reducer from "./reducer"

type Props = {
  taskDescription: string,
  clsList?: Array<string>,
  tagList?: Array<string>,
  enabledTools?: Array<string>,
  showTags?: boolean,
  selectedImage?: string,
  images: Array<Image>
}

export default ({
  images,
  selectedImage = images.length > 0 ? images[0].src : undefined,
  showTags = true,
  enabledTools = ["select", "create-point", "create-box", "create-polygon"],
  tagList = [],
  clsList = [],
  taskDescription
}: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    showTags,
    selectedImage,
    selectedTool: "select",
    mode: null,
    taskDescription,
    images,
    clsList,
    tagList,
    enabledTools,
    history: []
  })
  return <MainLayout debug state={state} dispatch={dispatch} />
}
