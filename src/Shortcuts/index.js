import React, { useState, useEffect } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { setIn } from "seamless-immutable"
import ShortcutField from "./ShortcutField"

const defaultShortcuts = {
  select: {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Select Region",
    key: "Escape",
  },
  zoom: {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Zoom In/Out",
    key: "z",
  },
  "create-point": {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Create Point",
  },
  "create-box": {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Add Bounding Box",
    key: "b",
  },
  pan: {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Pan",
  },
  "create-polygon": {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Create Polygon",
  },
  "create-pixel": {
    action: {
      type: "SELECT_TOOL",
    },
    name: "Create Pixel",
  },
  "prev-image": {
    action: {
      type: "HEADER_BUTTON_CLICKED",
      buttonName: "Prev",
    },
    name: "Previous Image",
    key: "a",
  },
  "next-image": {
    action: {
      type: "HEADER_BUTTON_CLICKED",
      buttonName: "Next",
    },
    name: "Next Image",
    key: "d", //"ArrowRight"
  },
}

export default ({ onShortcutActionDispatched }) => {
  const [shortcuts, setShortcuts] = useState({}) // useLocalStorage

  useEffect(() => {
    const newShortcuts = { ...shortcuts }
    for (const actionId of Object.keys(defaultShortcuts)) {
      if (!newShortcuts[actionId]) {
        newShortcuts[actionId] = defaultShortcuts[actionId]
      }
    }
    setShortcuts(newShortcuts)
  }, [])

  const onChangeShortcut = (actionId, keyName) => {
    setShortcuts(setIn(shortcuts, [actionId, "key"], keyName))
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      for (const actionId in shortcuts) {
        const shortcut = shortcuts[actionId]
        if (!shortcut || !shortcut.key) {
          continue
        }
        if (e.key === shortcut.key) {
          onShortcutActionDispatched({
            ...shortcut.action,
            selectedTool: actionId,
          })
        }
      }
    }

    window.addEventListener("keypress", handleKeyPress)

    return () => {
      window.removeEventListener("keypress", handleKeyPress)
      document.activeElement.blur()
    }
  }, [shortcuts])

  return (
    <SidebarBoxContainer title="Shortcuts">
      {Object.keys(shortcuts)
        .map((actionId, index) => {
          if (!shortcuts[actionId]) return null
          return (
            <ShortcutField
              key={actionId}
              actionId={actionId}
              actionName={shortcuts[actionId].name}
              keyName={shortcuts[actionId].key || ""}
              onChangeShortcut={onChangeShortcut}
            />
          )
        })
        .filter(Boolean)}
    </SidebarBoxContainer>
  )
}
