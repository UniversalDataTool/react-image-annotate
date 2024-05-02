// @flow
import { Action, Image, MainLayoutState } from "../../MainLayout/types";
import { ExpandingLine, moveRegion, Region } from "../../types/region-tools.ts";
import Immutable, { ImmutableObject } from "seamless-immutable";
import isEqual from "lodash/isEqual";
import getActiveImage from "./get-active-image";
import { saveToHistory } from "./history-handler";
import colors from "../../colors";
import fixTwisted from "./fix-twisted";
import convertExpandingLineToPolygon from "./convert-expanding-line-to-polygon";
import getLandmarksWithTransform from "../../utils/get-landmarks-with-transform";
import setInLocalStorage from "../../utils/set-in-local-storage";
import { clamp } from "../../utils/clamp";

const getRandomId = () => Math.random().toString().split(".")[1];

export default <T extends ImmutableObject<MainLayoutState>>(
  state: T,
  action: Action
): T => {
  if (
    state.allowedArea &&
    state.selectedTool !== "modify-allowed-area" &&
    ["MOUSE_DOWN", "MOUSE_UP", "MOUSE_MOVE"].includes(action.type) &&
    "x" in action
  ) {
    const aa = state.allowedArea;
    action.x = clamp(action.x, aa.x, aa.x + aa.w);
    action.y = clamp(action.y, aa.y, aa.y + aa.h);
  }

  if (action.type === "ON_CLS_ADDED" && !!action.cls) {
    const oldRegionClsList = state.regionClsList;
    const isStringRegionClsList = oldRegionClsList?.every(
      (cls) => typeof cls === "string"
    );
    if (!isStringRegionClsList) return state;
    return {
      ...state,
      regionClsList: ((oldRegionClsList || []) as string[]).concat(action.cls),
    };
  }

  // Throttle certain actions
  if (action.type === "MOUSE_MOVE") {
    if (Date.now() - (state.lastMouseMoveCall || 0) < 16)
      return Immutable(state) as T;
    state = Immutable(state).setIn(["lastMouseMoveCall"], Date.now()) as T;
  }
  if (!action.type.includes("MOUSE")) {
    state = Immutable(state).setIn(["lastAction"], action) as T;
  }

  const { currentImageIndex, pathToActiveImage, activeImage } =
    getActiveImage(state);

  const getRegionIndex = (region: number | string | Region) => {
    const regionId =
      typeof region === "string" || typeof region === "number"
        ? region
        : region.id;
    if (!activeImage) return null;
    const regionIndex = (activeImage.regions || []).findIndex(
      (r) => r.id === regionId
    );
    return regionIndex === -1 ? null : regionIndex;
  };
  const getRegion = (
    regionId: string | number | Region
  ): [Region | null, number | null] | null => {
    if (!activeImage) return null;
    const regionIndex = getRegionIndex(regionId);
    if (regionIndex === null || !activeImage.regions) return [null, null];
    const region = activeImage.regions[regionIndex];
    return [region, regionIndex];
  };
  const modifyRegion = (
    regionId: string | number | Region,
    obj: Partial<Region> | null
  ): ImmutableObject<MainLayoutState> => {
    const [region, regionIndex] = getRegion(regionId) ?? [null, null];
    if (!region || regionIndex === null) return state as T;
    if (obj !== null) {
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions", regionIndex.toString()],
        {
          ...region,
          ...obj,
        }
      ) as T;
    } else {
      // delete region
      const regions = activeImage?.regions;
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        (regions || []).filter((r) => r.id !== region.id)
      ) as T;
    }
  };
  // const unselectRegions = (state: MainLayoutState) => {
  //   if (!activeImage) return state;
  //   return Immutable(state).setIn(
  //     [...pathToActiveImage, "regions"],
  //     (activeImage.regions || []).map((r) => ({
  //       ...r,
  //       highlighted: false,
  //     }))
  //   );
  // };

  const closeEditors = (state: ImmutableObject<MainLayoutState>) => {
    if (currentImageIndex === null) {
      return state;
    }
    const path: string[] = [...pathToActiveImage, "regions"];
    const newValue = (activeImage?.regions || []).map((r) => ({
      ...r,
      editingLabels: false,
    }));
    return Immutable(state).setIn(path, newValue);
  };

  const setNewImage = (img: string | Image, index: number) => {
    let { frameTime }: Partial<Image> =
      typeof img === "object" ? img : { src: img, frameTime: undefined };
    return Immutable(
      Immutable(state).setIn(
        ["selectedImage"],
        index
      ) as ImmutableObject<MainLayoutState>
    ).setIn(["selectedImageFrameTime"], frameTime);
  };
  switch (action.type) {
    case "@@INIT": {
      return state;
    }
    case "SELECT_IMAGE": {
      return setNewImage(action.image, action.imageIndex) as T;
    }
    case "SELECT_CLASSIFICATION": {
      return Immutable(state).setIn(["selectedCls"], action.cls) as T;
    }
    case "CHANGE_REGION": {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      const oldRegion = activeImage?.regions?.[regionIndex];
      if (oldRegion?.cls !== action.region.cls) {
        state = saveToHistory(state, "Change Region Classification") as T;
        const clsIndex = action.region.cls
          ? state.regionClsList?.findIndex((cls) =>
              typeof cls === "string"
                ? cls === action.region.cls
                : cls.id === action.region.cls
            )
          : undefined;
        if (clsIndex !== undefined && clsIndex !== -1) {
          state = Immutable(state).setIn(
            ["selectedCls"],
            action.region.cls
          ) as T;
          action.region.color = colors[clsIndex % colors.length];
        }
      }
      if (!isEqual(oldRegion?.tags, action.region.tags)) {
        state = saveToHistory(state, "Change Region Tags") as T;
      }
      if (!isEqual(oldRegion?.comment, action.region.comment)) {
        state = saveToHistory(state, "Change Region Comment") as T;
      }
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions", regionIndex.toString()],
        action.region
      ) as T;
    }
    case "CHANGE_IMAGE": {
      if (!activeImage) return state;
      const { delta } = action;
      for (const key of Object.keys(delta)) {
        if (key === "cls") saveToHistory(state, "Change Image Class");
        if (key === "tags") saveToHistory(state, "Change Image Tags");
        state = Immutable(state).setIn(
          [...pathToActiveImage, key],
          delta[key as "cls" | "tags"]
        ) as T;
      }
      return state;
    }
    case "SELECT_REGION": {
      const { region } = action;
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      const regions = [...(activeImage?.regions || [])].map((r) => ({
        ...r,
        highlighted: r.id === region.id,
        editingLabels: r.id === region.id,
      }));
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        regions
      ) as T;
    }
    case "BEGIN_MOVE_POINT": {
      state = closeEditors(state) as T;
      return Immutable(state).setIn(["mode"], {
        mode: "MOVE_REGION",
        regionId: action.point.id,
      }) as T;
    }
    case "BEGIN_BOX_TRANSFORM": {
      const { box, directions } = action;
      state = closeEditors(state) as T;
      if (directions[0] === 0 && directions[1] === 0) {
        return Immutable(state).setIn(["mode"], {
          mode: "MOVE_REGION",
          regionId: box.id,
        }) as T;
      } else {
        return Immutable(state).setIn(["mode"], {
          mode: "RESIZE_BOX",
          regionId: box.id,
          freedom: directions,
          original: { x: box.x, y: box.y, w: box.w, h: box.h },
        }) as T;
      }
    }
    case "BEGIN_MOVE_POLYGON_POINT": {
      const { polygon, pointIndex } = action;
      state = closeEditors(state) as T;
      if (
        state.mode &&
        state.mode.mode === "DRAW_POLYGON" &&
        pointIndex === 0
      ) {
        const region = modifyRegion(polygon, {
          points: polygon.points.slice(0, -1),
          open: false,
        });
        return Immutable(region).setIn(["mode"], null) as T;
      } else {
        state = saveToHistory(state, "Move Polygon Point") as T;
      }
      return Immutable(state).setIn(["mode"], {
        mode: "MOVE_POLYGON_POINT",
        regionId: polygon.id,
        pointIndex,
      }) as T;
    }
    case "BEGIN_MOVE_KEYPOINT": {
      const { region, keypointId } = action;
      state = closeEditors(state) as T;
      state = saveToHistory(state, "Move Keypoint") as T;
      return Immutable(state).setIn(["mode"], {
        mode: "MOVE_KEYPOINT",
        regionId: region.id,
        keypointId,
      }) as T;
    }
    case "ADD_POLYGON_POINT": {
      const { polygon, point, pointIndex } = action;
      const regionIndex = getRegionIndex(polygon);
      if (regionIndex === null) return state;
      const points = [...polygon.points];
      points.splice(pointIndex, 0, point);
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions", regionIndex.toString()],
        {
          ...polygon,
          points,
        }
      ) as T;
    }
    case "MOUSE_MOVE": {
      const { x, y } = action;
      if (!state.mode) return state;
      if (!activeImage) return state;
      switch (state.mode.mode) {
        case "MOVE_POLYGON_POINT": {
          const { pointIndex, regionId } = state.mode;
          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null) return state;
          return Immutable(state).setIn(
            [
              ...pathToActiveImage,
              "regions",
              regionIndex.toString(),
              "points",
              pointIndex.toString(),
            ],
            [x, y]
          ) as T;
        }
        case "MOVE_KEYPOINT": {
          const { keypointId, regionId } = state.mode;
          const [region, regionIndex] = getRegion(regionId) || [null, null];
          if (
            region === null ||
            regionIndex === null ||
            region.type !== "keypoints" ||
            typeof region !== "object" ||
            !("points" in region)
          )
            return state;
          return Immutable(state).setIn(
            [
              ...pathToActiveImage,
              "regions",
              regionIndex.toString(),
              "points",
              keypointId,
            ],
            { ...region.points[keypointId], x, y }
          ) as T;
        }
        case "MOVE_REGION": {
          const { regionId } = state.mode;
          if (regionId === "$$allowed_area") {
            const { allowedArea: { w, h } = { w: 0, h: 0 } } = state;
            return Immutable(state).setIn(["allowedArea"], {
              x: x - w / 2,
              y: y - h / 2,
              w,
              h,
            }) as T;
          }
          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null || !activeImage.regions) return state;
          return Immutable(state).setIn(
            [...pathToActiveImage, "regions", regionIndex.toString()],
            moveRegion(activeImage.regions[regionIndex], x, y)
          ) as T;
        }
        case "RESIZE_BOX": {
          const {
            regionId,
            freedom: [xFree, yFree],
            original: { x: ox, y: oy, w: ow, h: oh },
          } = state.mode;

          const dx =
            xFree === 0 ? ox : xFree === -1 ? Math.min(ox + ow, x) : ox;
          const dw =
            xFree === 0
              ? ow
              : xFree === -1
              ? ow + (ox - dx)
              : Math.max(0, ow + (x - ox - ow));
          const dy =
            yFree === 0 ? oy : yFree === -1 ? Math.min(oy + oh, y) : oy;
          const dh =
            yFree === 0
              ? oh
              : yFree === -1
              ? oh + (oy - dy)
              : Math.max(0, oh + (y - oy - oh));

          // determine if we should switch the freedom
          if (dw <= 0.001) {
            state = Immutable(state).setIn(
              ["mode", "freedom"],
              [xFree * -1, yFree]
            ) as T;
          }
          if (dh <= 0.001) {
            state = Immutable(state).setIn(
              ["mode", "freedom"],
              [xFree, yFree * -1]
            ) as T;
          }

          if (regionId === "$$allowed_area") {
            return Immutable(state).setIn(["allowedArea"], {
              x: dx,
              w: dw,
              y: dy,
              h: dh,
            }) as T;
          }

          const regionIndex = getRegionIndex(regionId);
          if (regionIndex === null || !activeImage.regions) return state;
          const box = activeImage.regions[regionIndex];
          return Immutable(state).setIn(
            [...pathToActiveImage, "regions", regionIndex.toString()],
            {
              ...box,
              x: dx,
              w: dw,
              y: dy,
              h: dh,
            }
          ) as T;
        }
        case "RESIZE_KEYPOINTS": {
          const { regionId, landmarks, centerX, centerY } = state.mode;
          const distFromCenter = Math.sqrt(
            (centerX - x) ** 2 + (centerY - y) ** 2
          );
          const scale = distFromCenter / 0.15;
          return modifyRegion(regionId, {
            points: getLandmarksWithTransform({
              landmarks: landmarks.asMutable({ deep: true }),
              center: { x: centerX, y: centerY },
              scale,
            }),
          }) as T;
        }
        case "DRAW_POLYGON": {
          const { regionId } = state.mode;
          const [region, regionIndex] = getRegion(regionId) || [null, null];
          if (!region) return Immutable(state).setIn(["mode"], null) as T;
          if (
            typeof region !== "object" ||
            region.type !== "polygon" ||
            regionIndex === null
          )
            return state;
          const { points } = region;
          if (!Array.isArray(points)) return state;
          return Immutable(state).setIn(
            [
              ...pathToActiveImage,
              "regions",
              regionIndex.toString(),
              "points",
              (points.length - 1).toString(),
            ],
            [x, y]
          ) as T;
        }
        case "DRAW_LINE": {
          const { regionId } = state.mode;
          const [region, regionIndex] = getRegion(regionId) || [null, null];
          if (!region || typeof region !== "object" || regionIndex === null)
            return Immutable(state).setIn(["mode"], null) as T;
          return Immutable(state).setIn(
            [...pathToActiveImage, "regions", regionIndex.toString()],
            {
              ...region,
              x2: x,
              y2: y,
            }
          ) as T;
        }
        case "DRAW_EXPANDING_LINE": {
          const { regionId } = state.mode;
          const [expandingLine, regionIndex] = getRegion(regionId) || [
            null,
            null,
          ];
          if (
            !expandingLine ||
            typeof expandingLine !== "object" ||
            expandingLine.type !== "expanding-line" ||
            regionIndex === null
          )
            return state;
          const isMouseDown = Boolean(state.mouseDownAt);
          if (isMouseDown) {
            // If the mouse is down, set width/angle
            const lastPoint = expandingLine.points.slice(-1)[0];
            const mouseDistFromLastPoint = Math.sqrt(
              (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
            );
            if (mouseDistFromLastPoint < 0.002 && !lastPoint.width)
              return state;

            return Immutable(state).setIn(
              [
                ...pathToActiveImage,
                "regions",
                regionIndex.toString(),
                "points",
              ],
              expandingLine.points.slice(0, -1).concat([
                {
                  ...lastPoint,
                  width: mouseDistFromLastPoint * 2,
                  angle: Math.atan2(lastPoint.x - x, lastPoint.y - y),
                },
              ])
            ) as T;
          }
          // If mouse is up, move the next candidate point
          return Immutable(state).setIn(
            [...pathToActiveImage, "regions", regionIndex.toString()],
            {
              ...expandingLine,
              candidatePoint: { x, y },
            }
          ) as T;
        }
        case "SET_EXPANDING_LINE_WIDTH": {
          const { regionId } = state.mode;
          const [expandingLine, regionIndex] = getRegion(regionId) || [
            null,
            null,
          ];
          if (
            regionIndex === null ||
            !expandingLine ||
            typeof expandingLine !== "object" ||
            expandingLine.type !== "expanding-line"
          )
            return state;
          const lastPoint = expandingLine.points.slice(-1)[0];
          return Immutable(state).setIn(
            [
              ...pathToActiveImage,
              "regions",
              regionIndex.toString(),
              "expandingWidth",
            ],
            Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2)
          ) as T;
        }
        default:
          return state;
      }
    }
    case "MOUSE_DOWN": {
      if (!activeImage) return state;
      const { x, y } = action;

      state = Immutable(state).setIn(["mouseDownAt"], { x, y }) as T;

      if (state.mode) {
        switch (state.mode.mode) {
          case "DRAW_POLYGON": {
            const [polygon, regionIndex] = getRegion(state.mode.regionId) || [
              null,
              null,
            ];
            if (
              regionIndex === null ||
              !polygon ||
              typeof polygon !== "object" ||
              polygon.type !== "polygon"
            )
              break;
            return Immutable(state).setIn(
              [...pathToActiveImage, "regions", regionIndex.toString()],
              { ...polygon, points: polygon.points.concat([[x, y]]) }
            ) as T;
          }
          case "DRAW_LINE": {
            const [line, regionIndex] = getRegion(state.mode.regionId) || [
              null,
              null,
            ];
            if (!line || typeof line !== "object" || regionIndex === null)
              break;
            Immutable(state).setIn(
              [...pathToActiveImage, "regions", regionIndex.toString()],
              {
                ...line,
                x2: x,
                y2: y,
              }
            );
            return Immutable(state).setIn(["mode"], null) as T;
          }
          case "DRAW_EXPANDING_LINE": {
            const [expandingLine, regionIndex] = getRegion(
              state.mode.regionId
            ) || [null, null];
            if (
              regionIndex === null ||
              !expandingLine ||
              typeof expandingLine !== "object" ||
              expandingLine.type !== "expanding-line"
            )
              break;
            const lastPoint = expandingLine.points.slice(-1)[0];
            if (
              expandingLine.points.length > 1 &&
              Math.sqrt((lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2) < 0.002
            ) {
              if (!lastPoint.width) {
                return Immutable(state).setIn(["mode"], {
                  mode: "SET_EXPANDING_LINE_WIDTH",
                  regionId: state.mode.regionId,
                }) as T;
              } else {
                const newState = Immutable(state).setIn(
                  [...pathToActiveImage, "regions", regionIndex.toString()],
                  convertExpandingLineToPolygon(expandingLine)
                ) as T;
                return newState.setIn(["mode"], null) as T;
              }
            }

            // Create new point
            return Immutable(state).setIn(
              [
                ...pathToActiveImage,
                "regions",
                regionIndex.toString(),
                "points",
              ],
              expandingLine.points.concat([{ x, y, angle: null, width: null }])
            ) as T;
          }
          case "SET_EXPANDING_LINE_WIDTH": {
            const [expandingLine, regionIndex] = getRegion(
              state.mode.regionId
            ) || [null, null];
            if (
              regionIndex === null ||
              !expandingLine ||
              typeof expandingLine !== "object" ||
              expandingLine.type !== "expanding-line"
            )
              break;
            const { expandingWidth } = expandingLine;
            const newState = Immutable(state).setIn(
              [...pathToActiveImage, "regions", regionIndex.toString()],
              convertExpandingLineToPolygon({
                ...expandingLine,
                points: expandingLine.points.map((p) =>
                  p.width ? p : { ...p, width: expandingWidth || null }
                ),
                expandingWidth: undefined,
              })
            ) as T;
            return newState.setIn(["mode"], null) as T;
          }
          default:
            break;
        }
      }

      let newRegion;
      let defaultRegionCls = state.selectedCls,
        defaultRegionColor = "#ff0000";
      const clsIndex =
        defaultRegionCls && state.regionClsList
          ? state.regionClsList.findIndex((cls) =>
              typeof cls === "string"
                ? cls === defaultRegionCls
                : cls.id === defaultRegionCls
            )
          : -1;
      if (clsIndex !== -1) {
        defaultRegionColor = colors[clsIndex % colors.length];
      }

      switch (state.selectedTool) {
        case "create-point": {
          state = saveToHistory(state, "Create Point") as T;
          newRegion = {
            type: "point",
            x,
            y,
            highlighted: true,
            editingLabels: true,
            color: defaultRegionColor,
            id: getRandomId(),
            cls: defaultRegionCls,
          };
          break;
        }
        case "create-box": {
          state = saveToHistory(state, "Create Box") as T;
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
          };
          state = Immutable(state).setIn(["mode"], {
            mode: "RESIZE_BOX",
            editLabelEditorAfter: true,
            regionId: newRegion.id,
            freedom: [1, 1],
            original: { x, y, w: newRegion.w, h: newRegion.h },
            isNew: true,
          }) as T;
          break;
        }
        case "create-polygon": {
          if (state.mode && state.mode.mode === "DRAW_POLYGON") break;
          state = saveToHistory(state, "Create Polygon") as T;
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
          };
          state = Immutable(state).setIn(["mode"], {
            mode: "DRAW_POLYGON",
            regionId: newRegion.id,
          }) as T;
          break;
        }
        case "create-expanding-line": {
          state = saveToHistory(state, "Create Expanding Line") as T;
          newRegion = {
            type: "expanding-line",
            unfinished: true,
            points: [{ x, y, angle: null, width: null }],
            open: true,
            highlighted: true,
            color: defaultRegionColor,
            cls: defaultRegionCls,
            id: getRandomId(),
          };
          state = Immutable(state).setIn(["mode"], {
            mode: "DRAW_EXPANDING_LINE",
            regionId: newRegion.id,
          }) as T;
          break;
        }
        case "create-line": {
          if (state.mode && state.mode.mode === "DRAW_LINE") break;
          state = saveToHistory(state, "Create Line") as T;
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
          };
          state = Immutable(state).setIn(["mode"], {
            mode: "DRAW_LINE",
            regionId: newRegion.id,
          }) as T;
          break;
        }
        case "create-keypoints": {
          if (!state.keypointDefinitions) {
            console.error("No keypoint definitions");
            return state;
          }
          state = saveToHistory(state, "Create Keypoints") as T;
          const [[keypointsDefinitionId, { landmarks }]] = Object.entries(
            state.keypointDefinitions
          );
          newRegion = {
            type: "keypoints",
            keypointsDefinitionId,
            points: getLandmarksWithTransform({
              landmarks: landmarks.asMutable({ deep: true }),
              center: { x, y },
              scale: 1,
            }),
            highlighted: true,
            editingLabels: false,
            id: getRandomId(),
          };
          state = Immutable(state).setIn(["mode"], {
            mode: "RESIZE_KEYPOINTS",
            landmarks,
            centerX: x,
            centerY: y,
            regionId: newRegion.id,
            isNew: true,
          }) as T;
          break;
        }
        default:
          break;
      }

      const regions = [
        ...(Immutable(state).getIn(pathToActiveImage).regions || []),
      ]
        .map((r) =>
          Immutable(r)
            .setIn(["editingLabels"], false)
            .setIn(["highlighted"], false)
        )
        .concat(newRegion ? [newRegion] : []);

      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        regions
      ) as T;
    }
    case "MOUSE_UP": {
      const { x, y } = action;

      const { mouseDownAt = { x, y } } = state;
      if (!state.mode) return state;
      state = Immutable(state).setIn(["mouseDownAt"], null) as T;

      switch (state.mode?.mode) {
        case "RESIZE_BOX": {
          if (state.mode.isNew) {
            if (
              Math.abs(state.mode.original.x - x) < 0.002 ||
              Math.abs(state.mode.original.y - y) < 0.002
            ) {
              return Immutable(modifyRegion(state.mode.regionId, null)).setIn(
                ["mode"],
                null
              ) as T;
            }
          }
          if (state.mode.editLabelEditorAfter) {
            return {
              ...modifyRegion(state.mode.regionId, { editingLabels: true }),
              mode: null,
            } as T;
          }
          return { ...state, mode: null };
        }
        case "MOVE_REGION":
        case "RESIZE_KEYPOINTS":
        case "MOVE_POLYGON_POINT": {
          return { ...state, mode: null };
        }
        case "MOVE_KEYPOINT": {
          return { ...state, mode: null };
        }
        case "CREATE_POINT_LINE": {
          return state;
        }
        case "DRAW_EXPANDING_LINE": {
          const [expandingLine, regionIndex] = getRegion(
            state.mode.regionId
          ) || [null, null];
          if (
            regionIndex === null ||
            !expandingLine ||
            typeof expandingLine !== "object" ||
            expandingLine.type !== "expanding-line"
          )
            return state;
          let newExpandingLine = expandingLine;
          const lastPoint =
            expandingLine.points.length !== 0
              ? expandingLine.points.slice(-1)[0]
              : mouseDownAt;
          const mouseDistFromLastPoint = Math.sqrt(
            (lastPoint.x - x) ** 2 + (lastPoint.y - y) ** 2
          );
          if (mouseDistFromLastPoint > 0.002) {
            // The user is drawing has drawn the width for the last point
            const newPoints = [...expandingLine.points];
            for (let i = 0; i < newPoints.length - 1; i++) {
              if (newPoints[i].width) continue;
              newPoints[i] = {
                ...newPoints[i],
                width:
                  "width" in lastPoint ? (lastPoint.width as number) : 0.002,
              };
            }
            newExpandingLine = Immutable(expandingLine).setIn(
              ["points"],
              fixTwisted(newPoints)
            ) as unknown as ExpandingLine;
          } else {
            return state;
          }
          return Immutable(state).setIn(
            [...pathToActiveImage, "regions", regionIndex.toString()],
            newExpandingLine
          ) as T;
        }
        default:
          return state;
      }
    }
    case "OPEN_REGION_EDITOR": {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null || !activeImage?.regions) return state;
      const mapped = activeImage.regions.map((r) => ({
        ...r,
        highlighted: false,
        editingLabels: false,
      }));
      // @ts-ignore
      const newRegions = Immutable(mapped).setIn(
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
      );
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        newRegions
      ) as T;
    }
    case "CLOSE_REGION_EDITOR": {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions", regionIndex.toString()],
        {
          ...(activeImage?.regions || [])[regionIndex],
          editingLabels: false,
        }
      ) as T;
    }
    case "DELETE_REGION": {
      const regionIndex = getRegionIndex(action.region);
      if (regionIndex === null) return state;
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        (activeImage?.regions || []).filter((r) => r.id !== action.region.id)
      ) as T;
    }
    case "DELETE_SELECTED_REGION": {
      return Immutable(state).setIn(
        [...pathToActiveImage, "regions"],
        (activeImage?.regions || []).filter((r) => !r.highlighted)
      ) as T;
    }
    case "HEADER_BUTTON_CLICKED": {
      const buttonName = action.buttonName.toLowerCase();
      switch (buttonName) {
        case "prev": {
          if (
            currentImageIndex === null ||
            !("images" in state) ||
            !state.images
          )
            return state;
          if (currentImageIndex === 0) return state;
          if ("images" in state) {
            const image = state.images[currentImageIndex - 1] as Image;
            return setNewImage(image, currentImageIndex - 1) as T;
          }
          return state;
        }
        case "next": {
          if (currentImageIndex === null) return state;
          if (!("images" in state)) return state;
          if (currentImageIndex === state.images.length - 1) return state;
          return setNewImage(
            state.images[currentImageIndex + 1] as Image,
            +currentImageIndex + 1
          ) as T;
        }
        case "clone": {
          if (currentImageIndex === null) return state;
          if (!("images" in state)) return state;
          if (currentImageIndex === state.images.length - 1) return state;
          const newState = setNewImage(
            state.images[+currentImageIndex + 1] as Image,
            +currentImageIndex + 1
          ) as T;
          return Immutable(newState).setIn(
            ["images", (currentImageIndex + 1).toString(), "regions"],
            activeImage?.regions || []
          ) as T;
        }
        case "settings": {
          return Immutable(state).setIn(
            ["settingsOpen"],
            !state.settingsOpen
          ) as T;
        }
        case "help": {
          return state;
        }
        case "fullscreen": {
          return Immutable(state).setIn(["fullScreen"], true) as T;
        }
        case "exit fullscreen":
        case "window": {
          return Immutable(state).setIn(["fullScreen"], false) as T;
        }
        case "hotkeys": {
          return state;
        }
        case "exit":
        case "done": {
          return state;
        }
        default:
          return state;
      }
    }
    case "SELECT_TOOL": {
      if (action.selectedTool === "show-tags") {
        setInLocalStorage("showTags", !state.showTags);
        return Immutable(state).setIn(["showTags"], !state.showTags) as T;
      } else if (action.selectedTool === "show-mask") {
        return Immutable(state).setIn(["showMask"], !state.showMask) as T;
      }
      if (action.selectedTool === "modify-allowed-area" && !state.allowedArea) {
        state = Immutable(state).setIn(["allowedArea"], {
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        }) as T;
      }
      state = Immutable(state).setIn(["mode"], null) as T;
      return Immutable(state).setIn(["selectedTool"], action.selectedTool) as T;
    }
    case "CANCEL": {
      const { mode } = state;
      if (mode) {
        switch (mode.mode) {
          case "DRAW_EXPANDING_LINE":
          case "SET_EXPANDING_LINE_WIDTH":
          case "DRAW_POLYGON": {
            const { regionId } = mode;
            return modifyRegion(regionId, null) as T;
          }
          case "MOVE_POLYGON_POINT":
          case "RESIZE_BOX":
          case "MOVE_REGION": {
            return Immutable(state).setIn(["mode"], null) as T;
          }
          default:
            return state;
        }
      }
      // Close any open boxes
      const regions = activeImage?.regions;
      if (regions && regions.some((r) => r.editingLabels)) {
        return Immutable(state).setIn(
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            editingLabels: false,
          }))
        ) as T;
      } else if (regions) {
        return Immutable(state).setIn(
          [...pathToActiveImage, "regions"],
          regions.map((r) => ({
            ...r,
            highlighted: false,
          }))
        ) as T;
      }
      break;
    }
    default:
      break;
  }
  return state;
};
