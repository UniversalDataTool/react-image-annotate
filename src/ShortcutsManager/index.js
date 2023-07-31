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
    binding: "p",
  },
  {
    id: "create_bounding_box",
    description: "Create a bounding box",
    binding: "b",
  },
  {
    id: "create_line",
    description: "Create a line",
    binding: "l",
  }, {
    id: "create_scale",
    description: "Create a scale",
    binding: "s",
  },
  {
    id: "delete_region",
    description: "Delete selected region",
    binding: "d",
  },
  {
    id: "pan_tool",
    description: "Select the Pan Tool",
  },
  {
    id: "create_pixel",
    description: "Create a Pixel Mask",
  },
  {
    id: "save_and_previous_sample",
    description: "Save and go to previous sample",
    binding: "ArrowLeft",
  },
  {
    id: "save_and_next_sample",
    description: "Save and go to next sample",
    binding: "ArrowRight",
  },
  {
    id: "save_and_exit_sample",
    description: "Save and exit current sample",
  },
  // {
  //   id: "save_sample",
  //   description: "Save current sample",
  //   binding: "Ctrl+s",
  // },
  {
    id: "exit_sample",
    description: "Exit sample without saving",
  },
  {
    id: "undo",
    description: "Undo latest change",
    binding: "Ctrl+z",
  },
  {
    id: "hide",
    description: "hide regions of current image",
    binding: "h"
  },
]
export const defaultKeyMap = {}
for (const { id, binding } of defaultHotkeys) defaultKeyMap[id] = binding

export const useDispatchHotkeyHandlers = ({ dispatch }) => {
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
      create_bounding_box: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-box",
        })
      },
      create_line: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-line",
        })
      },
      create_scale: () => {
        dispatch({
          type: "SELECT_TOOL",
          selectedTool: "create-scale",
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
      delete_region: () => {
        dispatch({
          type: "DELETE_SELECTED_REGION",
        })
      },
      undo: () => {
        dispatch({
          type: "RESTORE_HISTORY",
        })
      },
      hide: () => {
        dispatch({
          type: "CHANGE_ALL_REGION_VISIBILITY"
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
  return handlers
}

export default ({ children, dispatch }) => {
  const handlers = useDispatchHotkeyHandlers({ dispatch })
  return (
    <HotKeys allowChanges handlers={handlers}>
      {children}
    </HotKeys>
  )
}
