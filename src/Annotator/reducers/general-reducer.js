// @flow

import type { MainLayoutState, Action } from "../../MainLayout/types"
import { moveRegion } from "../../ImageCanvas/region-tools.js"
import { getIn, setIn, updateIn } from "seamless-immutable"
import moment from "moment"
import isEqual from "lodash/isEqual"
import getActiveImage from "./get-active-image"
import { saveToHistory } from "./history-handler.js"

const getRandomId = () => Math.random().toString().split(".")[1]

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getRandomColor = () => {
  const h = getRandomInt(0, 360)
  const s = 100
  const l = 50
  return `hsl(${h},${s}%,${l}%)`
}

export default (state: MainLayoutState, action: Action) => {
  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - ((state: any).lastMouseMoveCall || 0) < 16) return state
    state = setIn(state, ["lastMouseMoveCall"], Date.now())
  }
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action)
  }

  const { currentImageIndex, pathToActiveImage, activeImage } = getActiveImage(
    state
  )

  const getRegionIndex = (region) => {
    const regionId = typeof region === "string" ? region : region.id
    if (!activeImage) return null
    const regionIndex = (activeImage.regions || []).findIndex(
      (r) => r.id === regionId
    )
    return regionIndex === -1 ? null : regionIndex
  }
  const getRegion = (regionId) => {
    if (!activeImage) return null
    const regionIndex = getRegionIndex(regionId)
    if (regionIndex === null) return [null, null]
    const region = activeImage.regions[regionIndex]
    return [region, regionIndex]
  }
  const modifyRegion = (regionId, obj) => {
    const [region, regionIndex] = getRegion(regionId)
    if (!region) return state
    if (obj !== null) {
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...region,
        ...obj,
      })
    } else {
      // delete region
      const regions = activeImage.regions
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (regions || []).filter((r) => r.id !== region.id)
      )
    }
  }
  const unselectRegions = (state: MainLayoutState) => {
    if (!activeImage) return state
    return setIn(
      state,
      [...pathToActiveImage, "regions"],
      (activeImage.regions || []).map((r) => ({
        ...r,
        highlighted: false,
      }))
    )
  }

  const closeEditors = (state: MainLayoutState) => {
    if (currentImageIndex === null) return state
    return setIn(
      state,
      [...pathToActiveImage, "regions"],
      (activeImage.regions || []).map((r) => ({
        ...r,
        editingLabels: false,
      }))
    )
  }

  const setNewImage = (img: string | Object) => {
    let { src, frameTime } = typeof img === "object" ? img : { src: img }
    return setIn(
      setIn(state, ["selectedImage"], src),
      ["selectedImageFrameTime"],
      frameTime
    )
  }

  switch (action.type) {
    case "@@INIT": {
      return state
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image)
    }
    case "CHANGE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const oldRegion = activeImage.regions[regionIndex]
      if (oldRegion.cls !== action.region.cls) {
        state = saveToHistory(state, "Change Region Classification")
      }
      if (!isEqual(oldRegion.tags, action.region.tags)) {
        state = saveToHistory(state, "Change Region Tags")
      }
      return setIn(
        state,
        [...pathToActiveImage, "regions", regionIndex],
        action.region
      )
    }
    case "CHANGE_IMAGE": {
      if (!activeImage) return state
      const { delta } = action
      for (const key of Object.keys(delta)) {
        if (key === "cls") saveToHistory(state, "Change Image Class")
        if (key === "tags") saveToHistory(state, "Change Image Tags")
        state = setIn(state, [...pathToActiveImage, key], delta[key])
      }
      return state
    }
    case "SELECT_REGION": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const regions = [...(activeImage.regions || [])].map((r) => ({
        ...r,
        highlighted: r.id === region.id,
        editingLabels: r.id === region.id,
      }))
      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "BEGIN_MOVE_POINT": {
      state = closeEditors(state)
      return setIn(state, ["mode"], {
        mode: "MOVE_REGION",
        regionId: action.point.id,
      })
    }
    case "BEGIN_BOX_TRANSFORM": {
      const { box, directions } = action
      state = closeEditors(state)
      if (directions[0] === 0 && directions[1] === 0) {
        return setIn(state, ["mode"], { mode: "MOVE_REGION", regionId: box.id })
      } else {
        return setIn(state, ["mode"], {
          mode: "RESIZE_BOX",
          regionId: box.id,
          freedom: directions,
          original: { x: box.x, y: box.y, w: box.w, h: box.h },
        })
      }
    }
    case "BEGIN_MOVE_POLYGON_POINT": {
      const { polygon, pointIndex } = action
      state = closeEditors(state)
      if (
        state.mode &&
        state.mode.mode === "DRAW_POLYGON" &&
        pointIndex === 0
      ) {
        return setIn(
          modifyRegion(polygon, {
            points: polygon.points.slice(0, -1),
            open: false,
          }),
          ["mode"],
          null
        )
      } else {
        state = saveToHistory(state, "Move Polygon Point")
      }
      return setIn(state, ["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon.id,
        pointIndex,
      })
    }
    case "ADD_POLYGON_POINT": {
      const { polygon, point, pointIndex } = action
      const regionIndex = getRegionIndex(polygon)
      if (regionIndex === null) return state
      const points = [...polygon.points]
      points.splice(pointIndex, 0, point)
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...polygon,
        points,
      })
    }
    case "MOUSE_MOVE": {
      const { x, y } = action
      if (!state.mode) return state
      if (!activeImage) return state
      switch (state.mode.mode) {
        case "MOVE_POLYGON_POINT": {
          const { pointIndex, regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              pointIndex,
            ],
            [x, y]
          )
        }
        case "MOVE_REGION": {
          const { regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex],
            moveRegion(activeImage.regions[regionIndex], x, y)
          )
        }
        case "RESIZE_BOX": {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh },
          } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          const box = activeImage.regions[regionIndex]

          const dx = xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox
          const dw =
            xFree === 0
              ? ow
              : xFree === -1
              ? ow + (ox - dx)
              : Math.max(0, ow + (x - ox - ow))
          const dy = yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy
          const dh =
            yFree === 0
              ? oh
              : yFree === -1
              ? oh + (oy - dy)
              : Math.max(0, oh + (y - oy - oh))

          // determine if we should switch the freedom
          if (dw <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree * -1, yFree])
          }
          if (dh <= 0.001) {
            state = setIn(state, ["mode", "freedom"], [xFree, yFree * -1])
          }

          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...box,
            x: dx,
            w: dw,
            y: dy,
            h: dh,
          })
        }
        case "DRAW_POLYGON": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              (region: any).points.length - 1,
            ],
            [x, y]
          )
        }
      }
      return state
    }
    case "MOUSE_DOWN": {
      if (!activeImage) return state
      const { x, y } = action

      let newRegion
      if (state.allowedArea) {
        const aa = state.allowedArea
        if (x < aa.x || x > aa.x + aa.w || y < aa.y || y > aa.y + aa.h) {
          return state
        }
      }

      switch (state.selectedTool) {
        case "create-point": {
          state = saveToHistory(state, "Create Point")
          newRegion = {
            type: "point",
            x,
            y,
            highlighted: true,
            editingLabels: true,
            color: getRandomColor(),
            id: getRandomId(),
          }
          break
        }
        case "create-box": {
          state = saveToHistory(state, "Create Box")
          newRegion = {
            type: "box",
            x: x,
            y: y,
            w: 0.01,
            h: 0.01,
            highlighted: true,
            editingLabels: false,
            color: getRandomColor(),
            id: getRandomId(),
          }
          state = unselectRegions(state)
          state = setIn(state, ["mode"], {
            mode: "RESIZE_BOX",
            editLabelEditorAfter: true,
            regionId: newRegion.id,
            freedom: [1, 1],
            original: { x, y, w: newRegion.w, h: newRegion.h },
            isNew: true,
          })
          break
        }
        case "create-polygon": {
          if (state.mode && state.mode.mode === "DRAW_POLYGON") break
          state = saveToHistory(state, "Create Polygon")
          newRegion = {
            type: "polygon",
            points: [
              [x, y],
              [x, y],
            ],
            open: true,
            highlighted: true,
            color: getRandomColor(),
            id: getRandomId(),
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_POLYGON",
            regionId: newRegion.id,
          })
          break
        }
      }

      if (newRegion) {
        state = unselectRegions(state)
      }

      if (state.mode) {
        switch (state.mode.mode) {
          case "DRAW_POLYGON": {
            const [polygon, regionIndex] = getRegion(state.mode.regionId)
            if (!polygon) break
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex],
              { ...polygon, points: polygon.points.concat([[x, y]]) }
            )
          }
        }
      }

      const regions = [...(activeImage.regions || [])]
        .map((r) => ({
          ...r,
          editingLabels: false,
        }))
        .concat(newRegion ? [newRegion] : [])

      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "MOUSE_UP": {
      const { x, y } = action
      if (!state.mode) return state
      switch (state.mode.mode) {
        case "RESIZE_BOX": {
          if (state.mode.isNew) {
            if (
              Math.abs(state.mode.original.x - x) < 0.01 &&
              Math.abs(state.mode.original.y - y) < 0.01
            ) {
              return setIn(
                modifyRegion(state.mode.regionId, null),
                ["mode"],
                null
              )
            }
          }
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null,
            }
          }
        }
        case "MOVE_REGION":
        case "MOVE_POLYGON_POINT": {
          return { ...state, mode: null }
        }
      }
      return state
    }
    case "CHANGE_REGION": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        [...pathToActiveImage, "regions", regionIndex],
        region
      )
    }
    case "OPEN_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const newRegions = setIn(
        activeImage.regions.map((r) => ({
          ...r,
          highlighted: false,
          editingLabels: false,
        })),
        [regionIndex],
        {
          ...(activeImage.regions || [])[regionIndex],
          highlighted: true,
          editingLabels: true,
        }
      )
      return setIn(state, [...pathToActiveImage, "regions"], newRegions)
    }
    case "CLOSE_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
        ...(activeImage.regions || [])[regionIndex],
        editingLabels: false,
      })
    }
    case "DELETE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => r.id !== action.region.id)
      )
    }
    case "HEADER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase()
      switch (buttonName) {
        case "prev": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === 0) return state
          return setNewImage(state.images[currentImageIndex - 1])
        }
        case "next": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setNewImage(state.images[currentImageIndex + 1])
        }
        case "clone": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setIn(
            setNewImage(state.images[currentImageIndex + 1]),
            ["images", currentImageIndex + 1, "regions"],
            activeImage.regions
          )
        }
        case "settings": {
          return setIn(state, ["settingsOpen"], !state.settingsOpen)
        }
        case "help": {
          return state
        }
        case "fullscreen": {
          return setIn(state, ["fullScreen"], true)
        }
        case "exit fullscreen":
        case "window": {
          return setIn(state, ["fullScreen"], false)
        }
        case "hotkeys": {
          return state
        }
        case "exit":
        case "done": {
          return state
        }
      }
      return state
    }
    case "SELECT_TOOL": {
      state = setIn(state, ["mode"], null)
      if (action.selectedTool === "show-tags") {
        return setIn(state, ["showTags"], !state.showTags)
      }
      return setIn(state, ["selectedTool"], action.selectedTool)
    }
    case "CANCEL": {
      const { mode } = state
      if (mode) {
        switch (mode.mode) {
          case "DRAW_POLYGON": {
            const { regionId } = mode
            return modifyRegion(regionId, null)
          }
          case "MOVE_POLYGON_POINT":
          case "RESIZE_BOX":
          case "MOVE_REGION": {
            return setIn(state, ["mode"], null)
          }
        }
      }
      // Close any open boxes
      const regions: any = activeImage.regions
      if (regions.some((r) => r.editingLabels)) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            editingLabels: false,
          }))
        )
      } else {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            highlighted: false,
          }))
        )
      }
    }
  }
  return state
}
