// @flow
import type { MainLayoutState, Action } from "../../MainLayout/types"
import { moveRegion } from "../../ImageCanvas/region-tools.js"
import { getIn, setIn, updateIn, set, merge } from "seamless-immutable"
import moment from "moment"
import isEqual from "lodash/isEqual"
import getActiveImage from "./get-active-image"
import { saveToHistory } from "./history-handler.js"
import colors from "../../colors"
import fixTwisted from "./fix-twisted"
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon"
import clamp from "clamp"
import getLandmarksWithTransform from "../../utils/get-landmarks-with-transform"
import setInLocalStorage from "../../utils/set-in-local-storage"
import DeviceList from "../../RegionLabel/DeviceList"

const getRandomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  )
}

const calculateIoU = (box1, box2) => {
  const x1 = Math.max(box1.x, box2.x)
  const y1 = Math.max(box1.y, box2.y)
  const x2 = Math.min(box1.x + box1.w, box2.x + box2.w)
  const y2 = Math.min(box1.y + box1.h, box2.y + box2.h)

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1)

  const box1Area = box1.w * box1.h
  const box2Area = box2.w * box2.h

  const union = box1Area + box2Area - intersection

  return intersection / union
}

const color_mapping = {
  "COMMUNICATION SYSTEMS": "#0000FF", // blue
  "FIRE ALARM": "#FF0000", // red
  LIGHTING: "#FFFF00", // yellow
  "MECHANICAL/ELECTRICAL": "#800080", // purple
  POWER: "#008000", // green
  "SECURITY SYSTEMS": "#545454", // light grey
  "CONDUIT AND WIRE": "#00FFFF", // bright cyan
  FEEDERS: "#66FF00", // bright green
  CABLE: "#C4A484", // everything below is light brown
  TRAY: "#C4A484",
  WIREMOLD: "#C4A484",
  BREAKERS: "#C4A484",
  WARNING: "#FFA500", // orange
}

const getColor = (device_name) => {
  let device_type = DeviceList.find((o) => o.symbol_name === device_name)
  if (device_type) {
    return color_mapping[device_type["category"]]
  } else {
    return "#C4A484"
  }
}
export default (state: MainLayoutState, action: Action) => {
  if (
    state.allowedArea &&
    state.selectedTool !== "modify-allowed-area" &&
    ["MOUSE_DOWN", "MOUSE_UP", "MOUSE_MOVE"].includes(action.type)
  ) {
    const aa = state.allowedArea
    action.x = clamp(action.x, aa.x, aa.x + aa.w)
    action.y = clamp(action.y, aa.y, aa.y + aa.h)
  }

  if (action.type === "ON_CLS_ADDED" && action.cls && action.cls !== "") {
    const oldRegionClsList = state.regionClsList
    const newState = {
      ...state,
      regionClsList: oldRegionClsList.concat(action.cls),
    }
    return newState
  }

  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - ((state: any).lastMouseMoveCall || 0) < 16) return state
    state = setIn(state, ["lastMouseMoveCall"], Date.now())
  }
  if (!action.type.includes("MOUSE")) {
    state = setIn(state, ["lastAction"], action)
  }

  const { currentImageIndex, pathToActiveImage, activeImage } =
    getActiveImage(state)

  const getRegionIndex = (region) => {
    const regionId =
      typeof region === "string" || typeof region === "number"
        ? region
        : region.id
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

  const getCategoryBySymbolName = (symbolName) => {
    const filteredDevice = DeviceList.find(
      (device) => device.symbol_name === symbolName
    )
    if (filteredDevice) {
      return filteredDevice.category
    } else {
      return undefined
    }
  }

  const setNewImage = (img: string | Object, index: number) => {
    let { src, frameTime } = typeof img === "object" ? img : { src: img }
    return setIn(
      setIn(state, ["selectedImage"], index),
      ["selectedImageFrameTime"],
      frameTime
    )
  }

  switch (action.type) {
    case "@@INIT": {
      return state
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image, action.imageIndex)
    }
    case "SELECT_CLASSIFICATION": {
      return setIn(state, ["selectedCls"], action.cls)
    }
    case "CHANGE_ALL_REGION_VISIBILITY": {
      let newState = { ...state }
      let current_visibility = getIn(state, [
        "images",
        currentImageIndex,
        "allRegionVisibility",
      ])
      let new_visibility =
        current_visibility === undefined || current_visibility === true
          ? false
          : true
      let newImage = getIn(newState, ["images", currentImageIndex])
      newImage = merge(newImage, [{ allRegionVisibility: new_visibility }])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      newRegions = newRegions.map((region) => ({
        ...region,
        visible: new_visibility,
      }))
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }
    case "TOGGLE_VISIBILITY": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }

      newRegions = newRegions.map((region) => {
        if (region.category === action.category) {
          // Toggle visibility if the region's category matches the action's category
          return {
            ...region,
            visible: action.isVisible,
          }
        } else {
          return region
        }
      })
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }
    case "ON_NEXT_OR_PREV_BREAKOUT_RESET": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newBreakouts = getIn(newState, ["breakouts"])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }

      newBreakouts = newBreakouts.map((breakout) => {
        return {
          ...breakout,
          visible: false,
        }
      })

      newRegions = newRegions.map((region) => {
        return {
          ...region,
          highlighted: false,
          visible: region.breakout
            ? region.breakout.visible
              ? false
              : true
            : true,
          breakout: region.breakout
            ? { ...region.breakout, visible: false }
            : undefined,
        }
      })
      newState = merge(newState, [{ breakouts: newBreakouts }])
      newState = merge(newState, [{ selectedBreakoutIdAutoAdd: null }])
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }
    case "TOGGLE_BREAKOUT_AUTO_ADD": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let selectedBreakoutIdAutoAdd = getIn(newState, [
        "selectedBreakoutIdAutoAdd",
      ])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])

      if (!newRegions) {
        return state
      }

      if (selectedBreakoutIdAutoAdd === action.breakoutId) {
        selectedBreakoutIdAutoAdd = null
      } else {
        selectedBreakoutIdAutoAdd = action.breakoutId
      }
      newState = merge(newState, [
        { selectedBreakoutIdAutoAdd: selectedBreakoutIdAutoAdd },
      ])
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)

      return newState
    }
    case "TOGGLE_BREAKOUT_VISIBILITY":
      const { images, breakouts } = state
      const currentImage = images[currentImageIndex]
      if (!currentImage || !currentImage.regions) {
        return state
      }

      const updatedBreakouts = breakouts.map((breakout) => {
        const isVisible =
          breakout.id === action.breakoutId ? !breakout.visible : false
        return { ...breakout, visible: isVisible }
      })

      let allBreakoutsInvisible = updatedBreakouts.every(
        (breakout) => !breakout.visible
      )
      let updatedRegions = currentImage.regions.map((region) => {
        const breakout = region.breakout
        let breakoutVisible = false
        if (breakout && breakout.id === action.breakoutId) {
          breakoutVisible = !breakout.visible
          allBreakoutsInvisible = allBreakoutsInvisible && !breakoutVisible
        }
        return {
          ...region,
          visible: breakoutVisible,
          breakout: breakout
            ? { ...breakout, visible: breakoutVisible }
            : undefined,
        }
      })

      if (allBreakoutsInvisible) {
        updatedRegions = updatedRegions.map((region) => ({
          ...region,
          visible: true,
          breakout: region.breakout
            ? { ...region.breakout, visible: false }
            : undefined,
        }))
      }

      const updatedImage = { ...currentImage, regions: updatedRegions }
      const updatedImages = [...images]
      updatedImages[currentImageIndex] = updatedImage

      return { ...state, images: updatedImages, breakouts: updatedBreakouts }
    case "ADD_NEW_BREAKOUT": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      const breakoutId = getRandomId()
      newRegions = newRegions.map((region) => {
        if (region.id === action.region.id) {
          return {
            ...region,
            breakout: {
              is_breakout: true,
              name: action.name,
              id: breakoutId,
              visible: false,
            },
          }
        } else {
          return region
        }
      })
      let newBreakouts = getIn(newState, ["breakouts"])
      newBreakouts = newBreakouts.concat({
        name: action.name,
        is_breakout: true,
        visible: false,
        id: breakoutId,
      })

      newImage = setIn(newImage, ["regions"], newRegions)
      newState = merge(newState, [{ breakouts: newBreakouts }])
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }
    case "ADD_NEW_BREAKOUT_BY_CATEGORY": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      let newBreakouts = getIn(newState, ["breakouts"])
      if (!newRegions) {
        return state
      }
      // check if all regions with the same category already have a breakout
      const regionsWithCategory = newRegions.filter(
        (region) => region.category === action.category
      )
      const regionsWithBreakout = regionsWithCategory.filter(
        (region) => region.breakout
      )
      if (regionsWithCategory.length === regionsWithBreakout.length) {
        return state
      }
      // first check to see if the breakout already exists. if it does exist then use the current breakout id, and add the breakout to the region
      const breakoutExists = newBreakouts.some(
        (breakout) => breakout.name === action.category
      )
      if (breakoutExists) {
        // iteratre through all the regions
        // if there is a region with the category being the same as the action.category then we check to see if there is a breakout with it,
        // if there isnt a breakout we add it to the current breakout, otherwise we do nothing to that region
        newRegions = newRegions.map((region) => {
          if (region.category === action.category && !region.breakout) {
            const matchingBreakout = newBreakouts.find(
              (breakout) => breakout.name === action.category
            )
            return {
              ...region,
              breakout: matchingBreakout
                ? { ...matchingBreakout }
                : {
                    is_breakout: true,
                    name: action.category,
                    id: matchingBreakout.id,
                    visible: false,
                  },
            }
          }
          return region
        })

        newBreakouts = newBreakouts.map(
          (breakout) => breakout.name === action.category && breakout
        )
      } else {
        const breakoutId = getRandomId()
        const newBreakout = {
          name: action.category,
          is_breakout: true,
          visible: false,
          id: breakoutId,
        }

        newRegions = newRegions.map((region) =>
          region.category === action.category
            ? { ...region, breakout: newBreakout }
            : region
        )

        newBreakouts = newBreakouts.concat(newBreakout)
      }

      newImage = setIn(newImage, ["regions"], newRegions)
      newState = merge(newState, [{ breakouts: newBreakouts }])
      newState = setIn(newState, ["images", currentImageIndex], newImage)

      return newState
    }
    case "ADD_NEW_BREAKOUT_BY_REGION_ID": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      let newBreakouts = getIn(newState, ["breakouts"])
      if (!newRegions) {
        return state
      }
      const breakoutId = getRandomId()
      // check if region already has a breakout
      const regionHasBreakout = newRegions.some(
        (region) => region.breakout && region.breakout.id === breakoutId
      )
      if (regionHasBreakout) {
        return state
      }

      newRegions = newRegions.map((region) => {
        if (region.id === action.region.id) {
          return {
            ...region,
            breakout: {
              is_breakout: true,
              name: action.name,
              id: breakoutId,
              visible: false,
            },
          }
        } else {
          return region
        }
      })

      newBreakouts = newBreakouts.concat({
        name: action.name,
        is_breakout: true,
        visible: false,

        id: breakoutId,
      })

      newImage = setIn(newImage, ["regions"], newRegions)
      newState = merge(newState, [{ breakouts: newBreakouts }])
      newState = setIn(newState, ["images", currentImageIndex], newImage)

      return newState
    }

    case "DELETE_BREAKOUT_BY_BREAKOUT_ID": {
      let newState = { ...state }
      let images = getIn(newState, ["images"])
      let newBreakouts = getIn(newState, ["breakouts"])
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      const deleteBreakoutId = action.breakoutId

      newBreakouts = newBreakouts.filter(
        (breakout) => breakout.id !== deleteBreakoutId
      )
      images = images.map((image, imgIDX) => {
        let regions = getIn(newState, ["images", imgIDX, "regions"])

        if (!regions) {
          return image
        }
        regions = regions.map((region) => {
          if (region.breakout && region.breakout.id === deleteBreakoutId) {
            // Toggle visibility if the region's category matches the action's category
            return {
              ...region,
              visible: true,
              breakout: undefined,
            }
          } else {
            return region
          }
        })
        newImage = setIn(image, ["regions"], regions)
        newState = setIn(newState, ["images", imgIDX], newImage)
      })
      newState = merge(newState, [{ breakouts: newBreakouts }])
      return newState
    }

    case "ADD_EXISTING_BREAKOUT": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      newRegions = newRegions.map((region) => {
        if (region.id === action.region.id) {
          return {
            ...region,
            breakout: {
              is_breakout: true,
              name: action.breakoutName,
              id: action.breakoutId,
              visible: false,
            },
          }
        } else {
          return region
        }
      })
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }

    case "REMOVE_BREAKOUT_BY_REGION_ID": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      newRegions = newRegions.map((region) => {
        if (region.id === action.region.id) {
          return {
            ...region,
            breakout: undefined,
          }
        } else {
          return region
        }
      })
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }

    case "DELETE_BREAKOUT": {
      let newState = { ...state }
      let newImage = getIn(newState, ["images", currentImageIndex])
      let newRegions = getIn(newState, ["images", currentImageIndex, "regions"])
      if (!newRegions) {
        return state
      }
      const deleteBreakoutId = action.breakoutId
      newRegions = newRegions.map((region) => {
        if (region.breakout.id === deleteBreakoutId) {
          // Toggle visibility if the region's category matches the action's category
          return {
            ...region,
            breakout: undefined,
          }
        } else {
          return region
        }
      })
      newImage = setIn(newImage, ["regions"], newRegions)
      newState = setIn(newState, ["images", currentImageIndex], newImage)
      return newState
    }
    case "CHANGE_REGION": {
      const regionIndex = getRegionIndex(action.region)
      if (regionIndex === null) return state
      const oldRegion = activeImage.regions[regionIndex]
      if (oldRegion.cls !== action.region.cls) {
        action.region.color = getColor(action.region.cls)
        action.region.visible = true
        action.region.category = getCategoryBySymbolName(action.region.cls)
        state = saveToHistory(state, "Change Region Classification")
        const clsIndex = state.regionClsList.indexOf(action.region.cls)
        if (clsIndex !== -1) {
          state = setIn(state, ["selectedCls"], action.region.cls)
        }
      }
      if (!isEqual(oldRegion.tags, action.region.tags)) {
        state = saveToHistory(state, "Change Region Tags")
      }
      if (!isEqual(oldRegion.comment, action.region.comment)) {
        state = saveToHistory(state, "Change Region Comment")
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
    case "CHANGE_IMAGE_NAME": {
      if (!activeImage) return state
      const { name } = action
      return setIn(state, [...pathToActiveImage, "name"], name)
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
    case "BEGIN_MOVE_KEYPOINT": {
      const { region, keypointId } = action
      state = closeEditors(state)
      state = saveToHistory(state, "Move Keypoint")
      return setIn(state, ["mode"], {
        mode: "MOVE_KEYPOINT",
        regionId: region.id,
        keypointId,
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
      const { mouseDownAt } = state
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
        case "MOVE_KEYPOINT": {
          const { keypointId, regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (regionIndex === null) return state
          return setIn(
            state,
            [
              ...pathToActiveImage,
              "regions",
              regionIndex,
              "points",
              keypointId,
            ],
            { ...(region: any).points[keypointId], x, y }
          )
        }
        case "MOVE_REGION": {
          const { regionId } = state.mode
          if (regionId === "$$allowed_area") {
            const {
              allowedArea: { w, h },
            } = state
            return setIn(state, ["allowedArea"], {
              x: x - w / 2,
              y: y - h / 2,
              w,
              h,
            })
          }
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

          if (regionId === "$$allowed_area") {
            return setIn(state, ["allowedArea"], {
              x: dx,
              w: dw,
              y: dy,
              h: dh,
            })
          }

          const regionIndex = getRegionIndex(regionId)
          if (regionIndex === null) return state
          const box = activeImage.regions[regionIndex]

          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...box,
            x: dx,
            w: dw,
            y: dy,
            h: dh,
          })
        }
        case "RESIZE_KEYPOINTS": {
          const { regionId, landmarks, centerX, centerY } = state.mode
          const distFromCenter = Math.sqrt(
            (centerX - x) ** 2 + (centerY - y) ** 2
          )
          const scale = distFromCenter / 0.15
          return modifyRegion(regionId, {
            points: getLandmarksWithTransform({
              landmarks,
              center: { x: centerX, y: centerY },
              scale,
            }),
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
        case "DRAW_LINE": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...region,
            x2: x,
            y2: y,
          })
        }
        case "ASSIGN_SCALE": {
          const { regionId } = state.mode
          const [region, regionIndex] = getRegion(regionId)
          if (!region) return setIn(state, ["mode"], null)
          return setIn(state, [...pathToActiveImage, "regions", regionIndex], {
            ...region,
            x2: x,
            y2: y,
          })
        }
        case "DRAW_EXPANDING_LINE": {
          const { regionId } = state.mode
          const [expandingLine, regionIndex] = getRegion(regionId)
          if (!expandingLine) return state
          const isMouseDown = Boolean(state.mouseDownAt)
          if (isMouseDown) {
            // If the mouse is down, set width/angle
            const lastPoint = expandingLine.points.slice(-1)[0]
            const mouseDistFromLastPoint = Math.sqrt(
              (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
            )
            if (mouseDistFromLastPoint < 0.002 && !lastPoint.width) return state

            const newState = setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex, "points"],
              expandingLine.points.slice(0, -1).concat([
                {
                  ...lastPoint,
                  width: mouseDistFromLastPoint * 2,
                  angle: Math.atan2(lastPoint.x - x, lastPoint.y - y),
                },
              ])
            )
            return newState
          } else {
            // If mouse is up, move the next candidate point
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex],
              {
                ...expandingLine,
                candidatePoint: { x, y },
              }
            )
          }

          return state
        }
        case "SET_EXPANDING_LINE_WIDTH": {
          const { regionId } = state.mode
          const [expandingLine, regionIndex] = getRegion(regionId)
          if (!expandingLine) return state
          const lastPoint = expandingLine.points.slice(-1)[0]
          const { mouseDownAt } = state
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex, "expandingWidth"],
            Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2)
          )
        }
        default:
          return state
      }
    }
    case "MOUSE_DOWN": {
      if (!activeImage) return state
      const { x, y } = action

      state = setIn(state, ["mouseDownAt"], { x, y })

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
          case "DRAW_LINE": {
            const [line, regionIndex] = getRegion(state.mode.regionId)
            if (!line) break
            const scales = activeImage.regions.filter(
              (region) => region.type === "scale"
            )
            let relativeLineLengthFt = 0
            if (scales.length !== 0) {
              const scaleValues = []
              scales.map((scale) => {
                let scaleVal = parseFloat(scale["cls"])
                if (scaleVal > 0) {
                  scaleValues.push(
                    Math.sqrt(
                      (scale["x1"] - scale["x2"]) ** 2 +
                        (scale["y1"] - scale["y2"]) ** 2
                    ) / scaleVal
                  )
                }
              })
              const average_total_scale =
                scaleValues.reduce((a, b) => a + b, 0) / scaleValues.length
              const relativeLineLength = Math.sqrt(
                (line.x1 - x) ** 2 + (line.y1 - y) ** 2
              )
              relativeLineLengthFt = relativeLineLength / average_total_scale
            }

            setIn(state, [...pathToActiveImage, "regions", regionIndex], {
              ...line,
              x2: x,
              y2: y,
              length_ft: relativeLineLengthFt,
            })
            return setIn(state, ["mode"], null)
          }
          case "ASSIGN_SCALE": {
            const [line, regionIndex] = getRegion(state.mode.regionId)
            if (!line) break
            setIn(state, [...pathToActiveImage, "regions", regionIndex], {
              ...line,
              x2: x,
              y2: y,
            })
            return setIn(state, ["mode"], null)
          }
          case "DRAW_EXPANDING_LINE": {
            const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
            if (!expandingLine) break
            const lastPoint = expandingLine.points.slice(-1)[0]
            if (
              expandingLine.points.length > 1 &&
              Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2) < 0.002
            ) {
              if (!lastPoint.width) {
                return setIn(state, ["mode"], {
                  mode: "SET_EXPANDING_LINE_WIDTH",
                  regionId: state.mode.regionId,
                })
              } else {
                return state
                  .setIn(
                    [...pathToActiveImage, "regions", regionIndex],
                    convertExpandingLineToPolygon(expandingLine)
                  )
                  .setIn(["mode"], null)
              }
            }

            // Create new point
            return setIn(
              state,
              [...pathToActiveImage, "regions", regionIndex, "points"],
              expandingLine.points.concat([{ x, y, angle: null, width: null }])
            )
          }
          case "SET_EXPANDING_LINE_WIDTH": {
            const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
            if (!expandingLine) break
            const { expandingWidth } = expandingLine
            return state
              .setIn(
                [...pathToActiveImage, "regions", regionIndex],
                convertExpandingLineToPolygon({
                  ...expandingLine,
                  points: expandingLine.points.map((p) =>
                    p.width ? p : { ...p, width: expandingWidth }
                  ),
                  expandingWidth: undefined,
                })
              )
              .setIn(["mode"], null)
          }
          default:
            break
        }
      }

      let newRegion
      let defaultRegionCls = state.selectedCls,
        defaultRegionColor = "#C4A484",
        category = getCategoryBySymbolName(defaultRegionCls)

      const clsIndex = (state.regionClsList || []).indexOf(defaultRegionCls)
      if (clsIndex !== -1) {
        defaultRegionColor = getColor(state.selectedCls)
      }

      switch (state.selectedTool) {
        case "create-point": {
          state = saveToHistory(state, "Create Point")
          let newRegionBreakout = undefined
          const { selectedBreakoutIdAutoAdd } = state
          if (selectedBreakoutIdAutoAdd !== null) {
            // create a breakout object with id === selectedBreakoutIdAutoAdd
            newRegionBreakout = state.breakouts.find(
              (breakout) => breakout.id === selectedBreakoutIdAutoAdd
            )
          }
          newRegion = {
            type: "point",
            x,
            y,
            highlighted: true,
            editingLabels: true,
            color: defaultRegionColor,
            id: getRandomId(),
            cls: defaultRegionCls,
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: newRegionBreakout,
          }
          break
        }
        case "create-box": {
          state = saveToHistory(state, "Create Box")
          let newRegionBreakout = undefined
          const { selectedBreakoutIdAutoAdd } = state
          if (selectedBreakoutIdAutoAdd !== null) {
            // create a breakout object with id === selectedBreakoutIdAutoAdd
            newRegionBreakout = state.breakouts.find(
              (breakout) => breakout.id === selectedBreakoutIdAutoAdd
            )
          }
          newRegion = {
            type: "box",
            x: x,
            y: y,
            w: 0,
            h: 0,
            highlighted: true,
            editingLabels: false,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: newRegionBreakout,
          }
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
          let newRegionBreakout = undefined
          const { selectedBreakoutIdAutoAdd } = state
          if (selectedBreakoutIdAutoAdd !== null) {
            // create a breakout object with id === selectedBreakoutIdAutoAdd
            newRegionBreakout = state.breakouts.find(
              (breakout) => breakout.id === selectedBreakoutIdAutoAdd
            )
          }
          newRegion = {
            type: "polygon",
            points: [
              [x, y],
              [x, y],
            ],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: newRegionBreakout,
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_POLYGON",
            regionId: newRegion.id,
          })
          break
        }
        case "create-expanding-line": {
          state = saveToHistory(state, "Create Expanding Line")
          let newRegionBreakout = undefined
          const { selectedBreakoutIdAutoAdd } = state
          if (selectedBreakoutIdAutoAdd !== null) {
            // create a breakout object with id === selectedBreakoutIdAutoAdd
            newRegionBreakout = state.breakouts.find(
              (breakout) => breakout.id === selectedBreakoutIdAutoAdd
            )
          }
          newRegion = {
            type: "expanding-line",
            unfinished: true,
            points: [{ x, y, angle: null, width: null }],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: newRegionBreakout,
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_EXPANDING_LINE",
            regionId: newRegion.id,
          })
          break
        }
        case "create-line": {
          if (state.mode && state.mode.mode === "DRAW_LINE") break
          state = saveToHistory(state, "Create Line")
          let newRegionBreakout = undefined
          const { selectedBreakoutIdAutoAdd } = state
          if (selectedBreakoutIdAutoAdd !== null) {
            // create a breakout object with id === selectedBreakoutIdAutoAdd
            newRegionBreakout = state.breakouts.find(
              (breakout) => breakout.id === selectedBreakoutIdAutoAdd
            )
          }
          newRegion = {
            type: "line",
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            highlighted: true,
            editingLabels: false,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: newRegionBreakout,
          }
          state = setIn(state, ["mode"], {
            mode: "DRAW_LINE",
            regionId: newRegion.id,
          })
          break
        }
        case "create-scale": {
          if (state.mode && state.mode.mode == "ASSIGN_SCALE") break
          state = saveToHistory(state, "Create scale")
          newRegion = {
            type: "scale",
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            unit: "ft",
            length: 0,
            highlighted: true,
            editingLabels: false,
            color: "#C4A484",
            cls: "1",
            id: getRandomId(),
            visible: true,
            breakout: undefined,
          }
          state = setIn(state, ["mode"], {
            mode: "ASSIGN_SCALE",
            regionId: newRegion.id,
          })
          break
        }
        case "create-keypoints": {
          state = saveToHistory(state, "Create Keypoints")
          const [[keypointsDefinitionId, { landmarks, connections }]] =
            (Object.entries(state.keypointDefinitions): any)

          newRegion = {
            type: "keypoints",
            keypointsDefinitionId,
            points: getLandmarksWithTransform({
              landmarks,
              center: { x, y },
              scale: 1,
            }),
            highlighted: true,
            editingLabels: false,
            id: getRandomId(),
            category: getCategoryBySymbolName(defaultRegionCls),
            visible: true,
            breakout: undefined,
          }
          state = setIn(state, ["mode"], {
            mode: "RESIZE_KEYPOINTS",
            landmarks,
            centerX: x,
            centerY: y,
            regionId: newRegion.id,
            isNew: true,
          })
          break
        }
        default:
          break
      }

      const regions = [...(getIn(state, pathToActiveImage).regions || [])]
        .map((r) =>
          setIn(r, ["editingLabels"], false).setIn(["highlighted"], false)
        )
        .concat(newRegion ? [newRegion] : [])

      return setIn(state, [...pathToActiveImage, "regions"], regions)
    }
    case "MOUSE_UP": {
      const { x, y } = action

      const { mouseDownAt = { x, y } } = state
      if (!state.mode) return state
      state = setIn(state, ["mouseDownAt"], null)
      switch (state.mode.mode) {
        case "RESIZE_BOX": {
          if (state.mode.isNew) {
            if (
              Math.abs(state.mode.original.x - x) < 0.002 ||
              Math.abs(state.mode.original.y - y) < 0.002
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
        case "RESIZE_KEYPOINTS":
        case "MOVE_POLYGON_POINT": {
          return { ...state, mode: null }
        }
        case "MOVE_KEYPOINT": {
          return { ...state, mode: null }
        }
        case "CREATE_POINT_LINE": {
          return state
        }
        case "DRAW_EXPANDING_LINE": {
          const [expandingLine, regionIndex] = getRegion(state.mode.regionId)
          if (!expandingLine) return state
          let newExpandingLine = expandingLine
          const lastPoint =
            expandingLine.points.length !== 0
              ? expandingLine.points.slice(-1)[0]
              : mouseDownAt
          let jointStart
          if (expandingLine.points.length > 1) {
            jointStart = expandingLine.points.slice(-2)[0]
          } else {
            jointStart = lastPoint
          }
          const mouseDistFromLastPoint = Math.sqrt(
            (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
          )
          if (mouseDistFromLastPoint > 0.002) {
            // The user is drawing has drawn the width for the last point
            const newPoints = [...expandingLine.points]
            for (let i = 0; i < newPoints.length - 1; i++) {
              if (newPoints[i].width) continue
              newPoints[i] = {
                ...newPoints[i],
                width: lastPoint.width,
              }
            }
            newExpandingLine = setIn(
              expandingLine,
              ["points"],
              fixTwisted(newPoints)
            )
          } else {
            return state
          }
          return setIn(
            state,
            [...pathToActiveImage, "regions", regionIndex],
            newExpandingLine
          )
        }
        default:
          return state
      }
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
          visible: true,
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
        isOCR: false,
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
    case "DELETE_SELECTED_REGION": {
      return setIn(
        state,
        [...pathToActiveImage, "regions"],
        (activeImage.regions || []).filter((r) => !r.highlighted)
      )
    }
    case "MATCH_REGION_LOADING": {
      return setIn(state, ["loadingTemplateMatching"], true)
    }
    case "MATCH_REGION_FINISHED": {
      // we need a new _pathToActiveImage to store the path of image where the template matching is applied to,
      // to prevent the case that the user may switch to another image while the template matching is still running,
      // and the result of template matching is applied to the wrong image.
      const page_index = action.page_properties.page_index
      let _pathToActiveImage = [...pathToActiveImage]
      _pathToActiveImage[_pathToActiveImage.length - 1] = page_index
      let page_properties = action.page_properties
      let old_regions = [...(getIn(state, _pathToActiveImage).regions || [])]
      let new_regions = action.region

      // remove the new regions that have IoU > 0.5 with the old regions to prevent duplicate regions
      for (let i = 0; i < old_regions.length; i++) {
        for (let j = 0; j < new_regions.length; j++) {
          let iou_temp = calculateIoU(old_regions[i], new_regions[j])
          if (iou_temp > 0.5) {
            new_regions.splice(j, 1)
            break
          }
        }
      }

      // append new regions to the old regions, and reset highlighting
      let regions = [...(getIn(state, _pathToActiveImage).regions || [])]
        .map((r) =>
          setIn(r, ["editingLabels"], false).setIn(["highlighted"], false)
        )
        .concat(action.region ? [...action.region] : [])
      let newState = { ...state }
      newState = setIn(newState, ["loadingTemplateMatching"], false)
      return setIn(newState, [..._pathToActiveImage, "regions"], regions)
    }
    case "HEADER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase()
      switch (buttonName) {
        case "prev": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === 0) return state
          return setNewImage(
            state.images[currentImageIndex - 1],
            currentImageIndex - 1
          )
        }
        case "next": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setNewImage(
            state.images[currentImageIndex + 1],
            currentImageIndex + 1
          )
        }
        case "clone": {
          if (currentImageIndex === null) return state
          if (currentImageIndex === state.images.length - 1) return state
          return setIn(
            setNewImage(
              state.images[currentImageIndex + 1],
              currentImageIndex + 1
            ),
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
        case "save": {
          let newState = { ...state }
          let newImage = getIn(newState, ["images", currentImageIndex])
          let newRegions = getIn(newState, [
            "images",
            currentImageIndex,
            "regions",
          ])
          if (!newRegions) {
            return state
          }
          newRegions = newRegions.map((region) => ({
            ...region,
            visible: true,
          }))
          newImage = setIn(newImage, ["regions"], newRegions)
          newState = setIn(newState, ["images", currentImageIndex], newImage)
          return newState
        }
        case "done": {
          return state
        }
        default:
          return state
      }
    }
    case "SELECT_TOOL": {
      if (action.selectedTool === "show-tags") {
        setInLocalStorage("showTags", !state.showTags)
        return setIn(state, ["showTags"], !state.showTags)
      } else if (action.selectedTool === "show-mask") {
        return setIn(state, ["showMask"], !state.showMask)
      }
      if (action.selectedTool === "modify-allowed-area" && !state.allowedArea) {
        state = setIn(state, ["allowedArea"], { x: 0, y: 0, w: 1, h: 1 })
      }
      state = setIn(state, ["mode"], null)
      return setIn(state, ["selectedTool"], action.selectedTool)
    }
    case "CANCEL": {
      const { mode } = state
      if (mode) {
        switch (mode.mode) {
          case "DRAW_EXPANDING_LINE":
          case "SET_EXPANDING_LINE_WIDTH":
          case "DRAW_POLYGON": {
            const { regionId } = mode
            return modifyRegion(regionId, null)
          }
          case "MOVE_POLYGON_POINT":
          case "RESIZE_BOX":
          case "MOVE_REGION": {
            return setIn(state, ["mode"], null)
          }
          default:
            return state
        }
      }
      // Close any open boxes
      const regions: any = activeImage.regions
      if (regions && regions.some((r) => r.editingLabels)) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            editingLabels: false,
          }))
        )
      } else if (regions) {
        return setIn(
          state,
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            highlighted: false,
          }))
        )
      }
      break
    }
    default:
      break
  }
  return state
}
