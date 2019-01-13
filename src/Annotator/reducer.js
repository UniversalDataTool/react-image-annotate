// @flow

import type { MainLayoutState, Action } from "../MainLayout/types"
import { moveRegion } from "../ImageCanvas/region-tools.js"
import { setIn } from "seamless-immutable"

export default (state: MainLayoutState, action: Action) => {
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action)
  }
  let currentImageIndex = state.images.findIndex(
    img => img.src === state.selectedImage
  )
  if (currentImageIndex === -1) currentImageIndex = null
  const getRegionIndex = region => {
    const regionId = typeof region === "string" ? region : region.id
    if (currentImageIndex === null) return null
    const regionIndex = (
      state.images[currentImageIndex].regions || []
    ).findIndex(r => r.id === regionId)
    return regionIndex === -1 ? null : regionIndex
  }

  const setNewImage = (newImage: string) => {
    return setIn(state, ["selectedImage"], newImage)
  }

  switch (action.type) {
    case "@@INIT": {
      return state
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image.src)
    }
    case "CHANGE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        ["images", currentImageIndex, "regions", regionIndex],
        action.region
      )
    }
    case "RESTORE_HISTORY": {
      if (state.history.length > 0) {
        return state.history[state.history.length - 1]
      }
      return state
    }
    case "SELECT_REGION": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const regions = [...(state.images[currentImageIndex].regions || [])].map(
        r => ({
          ...r,
          highlighted: r.id === region.id
        })
      )
      return setIn(state, ["images", currentImageIndex, "regions"], regions)
    }
    case "BEGIN_MOVE_POINT": {
      return setIn(state, ["mode"], {
        mode: "MOVE_REGION",
        regionId: action.point.id
      })
    }
    case "BEGIN_BOX_TRANSFORM": {
      const { box, directions } = action
      if (directions[0] === 0 && directions[1] === 0) {
        return setIn(state, ["mode"], { mode: "MOVE_REGION", regionId: box.id })
      } else {
        return setIn(state, ["mode"], {
          mode: "RESIZE_BOX",
          regionId: box.id,
          freedom: directions,
          original: { x: box.x, y: box.y, w: box.w, h: box.h }
        })
      }
    }
    case "BEGIN_MOVE_POLYGON_POINT": {
      const { polygon, pointIndex } = action
      return setIn(state, ["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon.id,
        pointIndex
      })
    }
    case "ADD_POLYGON_POINT": {
      const { polygon, point, pointIndex } = action
      const regionIndex = getRegionIndex(polygon)
      if (regionIndex === null) return state
      const points = [...polygon.points]
      points.splice(pointIndex, 0, point)
      return setIn(
        state,
        ["images", currentImageIndex, "regions", regionIndex],
        { ...polygon, points }
      )
    }
    case "MOUSE_MOVE": {
      const { x, y } = action
      if (!state.mode) return state
      if (currentImageIndex === null) return state
      switch (state.mode.mode) {
        case "MOVE_POLYGON_POINT": {
          const { pointIndex, regionId } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === 0) return state
          return setIn(
            state,
            [
              "images",
              currentImageIndex,
              "regions",
              regionIndex,
              "points",
              pointIndex
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
            ["images", currentImageIndex, "regions", regionIndex],
            moveRegion(
              state.images[currentImageIndex].regions[regionIndex],
              x,
              y
            )
          )
        }
        case "RESIZE_BOX": {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh }
          } = state.mode
          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          const box = state.images[currentImageIndex].regions[regionIndex]

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

          return setIn(
            state,
            ["images", currentImageIndex, "regions", regionIndex],
            { ...box, x: dx, w: dw, y: dy, h: dh }
          )
        }
      }
      return state
    }
    case "MOUSE_DOWN": {
      const { x, y } = action
      return state
    }
    case "MOUSE_UP": {
      const { x, y } = action
      if (!state.mode) return state
      switch (state.mode.mode) {
        case "MOVE_REGION":
        case "RESIZE_BOX":
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
        ["images", currentImageIndex, "regions", regionIndex],
        region
      )
    }
    case "OPEN_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const newRegions = setIn(
        state.images[currentImageIndex].regions.map(r => ({
          ...r,
          editingLabels: false
        })),
        [regionIndex],
        {
          ...(state.images[currentImageIndex].regions || [])[regionIndex],
          editingLabels: true
        }
      )
      return setIn(state, ["images", currentImageIndex, "regions"], newRegions)
    }
    case "CLOSE_REGION_EDITOR": {
      const { region } = action
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        ["images", currentImageIndex, "regions", regionIndex],
        {
          ...(state.images[currentImageIndex].regions || [])[regionIndex],
          editing: false
        }
      )
    }
    case "DELETE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      return setIn(
        state,
        ["images", currentImageIndex, "regions"],
        (state.images[currentImageIndex].regions || []).filter(
          r => r.id !== action.region.id
        )
      )
    }
    case "HEADER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase()
      switch (buttonName) {
        case "prev": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === 0) return state
          return setNewImage(state.images[currentImageIndex - 1].src)
        }
        case "next": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setNewImage(state.images[currentImageIndex + 1].src)
        }
        case "settings": {
          return state
        }
        case "help": {
          return state
        }
        case "fullscreen": {
          return state
        }
        case "hotkeys": {
          return state
        }
        case "exit": {
          return state
        }
      }
      return state
      // return setIn(state, [""]
    }
    case "SELECT_TOOL": {
      if (action.selectedTool === "show-tags") {
        return setIn(state, ["showTags"], !state.showTags)
      }
      return setIn(state, ["selectedTool"], action.selectedTool)
    }
  }
  return state
}
