import React, { useMemo } from "react"
import { HotKeys } from "react-hotkeys"

export const defaultHotkeys = [
  {
    id: "select_tool",
    description: "Switch to the Select Tool",
    binding: "escape",
  },
  {
    id: "zoom_tool",
    description: "Select the Zoom Tool",
    binding: "z",
  },
  {
    id: "create_point",
    description: "Create a point",
  },
  {
    id: "pan_tool",
    description: "Select the Pan Tool",
  },
  {
    id: "create_polygon",
    description: "Create a Polygon",
  },
  {
    id: "create_pixel",
    description: "Create a Pixel Mask",
  },
  {
    id: "save_and_previous_sample",
    description: "Save and go to previous sample",
  },
  {
    id: "save_and_next_sample",
    description: "Save and go to next sample",
  },
  {
    id: "save_and_exit_sample",
    description: "Save and exit current sample",
  },
  {
    id: "exit_sample",
    description: "Exit sample without saving",
  },
]
export const defaultKeyMap = {}
for (const { id, binding } of defaultHotkeys) defaultKeyMap[id] = binding

export default ({ children, dispatch }) => {
  const handlers = useMemo(
    () => ({
      select_tool: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "select",
        })
      },
      zoom_tool: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "zoom",
        })
      },
      create_point: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-point",
        })
      },
      pan_tool: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "pan",
        })
      },
      create_polygon: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-polygon",
        })
      },
      create_pixel: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-pixel",
        })
      },
      save_and_previous_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Prev",
        })
      },
      save_and_next_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Next",
        })
      },
      save_and_exit_sample: () => {
        dispatch({
          type: "HEADER_BUTTON_CLICKED",
          buttonName: "Save",
        })
      },
      // TODO
      // exit_sample: () => {
      //   dispatch({
      //     type: "",
      //   })
      // }
    }),
    [dispatch]
  )
  return (
    <HotKeys allowChanges handlers={handlers}>
      {children}
    </HotKeys>
  )
}
