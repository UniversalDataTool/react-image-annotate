// @flow

import type { Action, MainLayoutState } from "./types"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import React, { useCallback, useMemo, useRef } from "react"
import { makeStyles } from "@mui/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { styled } from "@mui/material/styles"
import ClassSelectionMenu from "../ClassSelectionMenu"
import DebugBox from "../DebugSidebarBox"
import HistorySidebarBox from "../HistorySidebarBox"
import ImageCanvas from "../ImageCanvas"
import ImageSelector from "../ImageSelectorSidebarBox"
import GroupSelector from "../GroupSelectorSidebarBox"
import KeyframeTimeline from "../KeyframeTimeline"
import KeyframesSelector from "../KeyframesSelectorSidebarBox"
import type { Node } from "react"
import RegionSelector from "../RegionSelectorSidebarBox"
import SettingsDialog from "../SettingsDialog"
import TagsSidebarBox from "../TagsSidebarBox"
import TaskDescription from "../TaskDescriptionSidebarBox"
import Help from "../HelpSidebarBox"
import MetadataEditor from "../MetadataEditorSidebarBox"
import GroupsEditor from "../GroupsEditorSidebarBox"
import Workspace from "react-material-workspace-layout/Workspace"
import classnames from "classnames"
import getActiveImage from "../Annotator/reducers/get-active-image"
import getHotkeyHelpText from "../utils/get-hotkey-help-text"
import iconDictionary from "./icon-dictionary"
import styles from "./styles"
import { defaultKeyMap, useDispatchHotkeyHandlers } from "../ShortcutsManager"
import useEventCallback from "use-event-callback"
import useImpliedVideoRegions from "./use-implied-video-regions"
import useKey from "use-key-hook"
import { useSettings } from "../SettingsProvider"
import { GlobalHotKeys, withHotKeys } from "react-hotkeys"
import Editor from "../Editor"
import regionsToBlocks from '../utils/regions-to-blocks';
import PageSelector from "../PageSelector"
import regionsGroups from '../utils/regions-groups';
import RightSidebarItemsWrapper from './RightSidebarItemsWrapper';
import Locker from '../Locker';
import { reacalcActionsEnum } from "../utils/saveable-actions-enum";
import intersection from "lodash/intersection";
import useColors from '../hooks/use-colors';

// import Fullscreen from "../Fullscreen"

const emptyArr = []
const theme = createTheme()
const useStyles = makeStyles((theme) => styles)

const HotkeyDiv = withHotKeys(({ hotKeys, children, divRef, ...props }) => (
  <div {...{ ...hotKeys, ...props }} ref={divRef}>
    {children}
  </div>
))

const isEditableKeyboardTarget = (target) => {
  if (!target || !target.tagName) return false
  const tag = target.tagName.toLowerCase()
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    Boolean(target.isContentEditable)
  )
}

const FullScreenContainer = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  "& .fullscreen": {
    width: "100%",
    height: "100%",
  },
}))

const WorkspaceWrapper = styled("div")(({ theme }) => ({
  height: "100vh",
  width: "auto",
  backgroundColor: "red",
  flex: 1,
}))

const EditorWrapper = styled("div")(({ theme }) => ({
  padding: "1rem",
  paddingLeft: "2rem",
  height: "100vh",
  width: "30vw",
  overflowY: "scroll"
}))

type Props = {
  state: MainLayoutState,
  RegionEditLabel?: Node,
  dispatch: (Action) => any,
  alwaysShowNextButton?: boolean,
  alwaysShowPrevButton?: boolean,
  onRegionClassAdded: () => {},
  hideHeader?: boolean,
  hideHeaderText?: boolean,
  groups?: Array<any>,
  onGroupSelect?: (any) => any,
  hideHistory?: boolean,
  hideNotEditingLabel?: boolean,
  showEditor?: boolean,
  showPageSelector?: boolean,
  recalcActive?: boolean,
  saveActive?: boolean,
  onMetadataChange: (any) => any,
  onAddGroup: (any) => any,
  onRecalcClick: (any) => any,
  updatedBy?: ?string,
  mediaPresenterLeaseUntil?: ?string,
  humanProcessorConfirmation?: ?{ confirmedAt?: string, confirmedBy?: string },
  onHumanProcessorConfirmationChange?: (boolean) => any,
}

export const MainLayout = ({
  state,
  dispatch,
  alwaysShowNextButton = false,
  alwaysShowPrevButton = false,
  RegionEditLabel,
  onRegionClassAdded,
  hideHeader,
  hideHeaderText,
  hideNext = false,
  hidePrev = false,
  hideClone = false,
  hideSettings = false,
  hideFullScreen = false,
  hideSave = false,
  groups = [],
  onGroupSelect = () => { },
  hideHistory = false,
  hideNotEditingLabel = false,
  showEditor = false,
  showPageSelector = false,
  recalcActive = false,
  saveActive = false,
  onMetadataChange,
  onAddGroup,
  onRecalcClick,
  updatedBy,
  mediaPresenterLeaseUntil,
  humanProcessorConfirmation,
  onHumanProcessorConfirmationChange,
}: Props) => {
  const classes = useStyles()
  const settings = useSettings()
  const fullScreenHandle = useFullScreenHandle()
  const { clsColor } = useColors();

  const memoizedActionFns = useRef({})
  const action = (type: string, ...params: Array<string>) => {
    const fnKey = `${type}(${params.join(",")})`
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey]

    const fn = (...args: any) =>
      params.length > 0
        ? dispatch(
          ({
            type,
            ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
          }: any)
          )
        : dispatch({ type, ...args[0] })
memoizedActionFns.current[fnKey] = fn
return fn
}

const { currentImageIndex, activeImage } = getActiveImage(state)
let nextImage
if (currentImageIndex !== null) {
  nextImage = state.images[currentImageIndex + 1]
}

useKey(() => dispatch({ type: "CANCEL" }), {
  detectKeys: [27],
})

const isAVideoFrame = activeImage && activeImage.frameTime !== undefined
const innerContainerRef = useRef()
const hotkeyHandlers = useDispatchHotkeyHandlers({ dispatch })
const lastHotkeyRef = useRef({ name: null, at: 0 })
const guardedHotkeyHandlers = useMemo(() => {
  const lastHotkey = lastHotkeyRef.current
  return Object.keys(hotkeyHandlers).reduce((acc, name) => {
    acc[name] = (...args) => {
      const now = typeof performance !== "undefined" ? performance.now() : Date.now()
      if (lastHotkey.name === name && now - lastHotkey.at < 20) return
      lastHotkey.name = name
      lastHotkey.at = now
      return hotkeyHandlers[name](...args)
    }
    return acc
  }, {})
}, [hotkeyHandlers])

let impliedVideoRegions = useImpliedVideoRegions(state)

const refocusOnMouseEvent = useCallback((e) => {
  if (!innerContainerRef.current) return
  // Keep typing in metadata fields (Section, Mutation, …) while the mouse
  // moves over the canvas. Hotkeys still work via GlobalHotKeys.
  if (isEditableKeyboardTarget(e.target)) return
  if (isEditableKeyboardTarget(document.activeElement)) return
  if (innerContainerRef.current.contains(e.target)) {
    innerContainerRef.current.focus()
  }
}, [])

const preventEnterActivatingButtons = useCallback((e) => {
  if (e.key !== "Enter") return
  if (isEditableKeyboardTarget(e.target)) return
  e.preventDefault()
}, [])

const allowedGroups = useMemo(() => regionsGroups(state.images[state.selectedImage].regions), [state.images, state.selectedImage])

const canvas = (
  <ImageCanvas
    {...settings}
    showCrosshairs={
      settings.showCrosshairs &&
      !["select", "pan", "zoom"].includes(state.selectedTool)
    }
    key={state.selectedImage}
    showMask={state.showMask}
    fullImageSegmentationMode={state.fullImageSegmentationMode}
    autoSegmentationOptions={state.autoSegmentationOptions}
    showTags={state.showTags}
    allowedArea={state.allowedArea}
    modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
    regionClsList={state.regionClsList}
    regionTagList={state.regionTagList}
    regions={
      state.annotationType === "image"
        ? activeImage.regions || []
        : impliedVideoRegions
    }
    realSize={activeImage ? activeImage.realSize : undefined}
    videoPlaying={state.videoPlaying}
    imageSrc={state.annotationType === "image" ? activeImage.src : null}
    videoSrc={state.annotationType === "video" ? state.videoSrc : null}
    pointDistancePrecision={state.pointDistancePrecision}
    createWithPrimary={state.selectedTool.includes("create")}
    dragWithPrimary={state.selectedTool === "pan"}
    zoomWithPrimary={state.selectedTool === "zoom"}
    showPointDistances={state.showPointDistances}
    videoTime={
      state.annotationType === "image"
        ? state.selectedImageFrameTime
        : state.currentVideoTime
    }
    keypointDefinitions={state.keypointDefinitions}
    onMouseMove={action("MOUSE_MOVE")}
    onMouseDown={action("MOUSE_DOWN")}
    onMouseUp={action("MOUSE_UP")}
    onChangeRegion={action("CHANGE_REGION", "region")}
    onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
    onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
    onDeleteRegion={action("DELETE_REGION", "region")}
    onDeleteGroup={action("DELETE_GROUP", "groupId")}
    onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "box", "directions")}
    onResetZoom={() => dispatch({
      type: "ZOOM_RESET",
    })}
    onBeginMovePolygonPoint={action(
      "BEGIN_MOVE_POLYGON_POINT",
      "polygon",
      "pointIndex"
    )}
    onBeginMoveKeypoint={action(
      "BEGIN_MOVE_KEYPOINT",
      "region",
      "keypointId"
    )}
    onAddPolygonPoint={action(
      "ADD_POLYGON_POINT",
      "polygon",
      "point",
      "pointIndex"
    )}
    onSelectRegion={action("SELECT_REGION", "region")}
    onBeginMovePoint={action("BEGIN_MOVE_POINT", "point")}
    onImageLoaded={action("IMAGE_LOADED", "image")}
    RegionEditLabel={RegionEditLabel}
    onImageOrVideoLoaded={action("IMAGE_OR_VIDEO_LOADED", "metadata")}
    onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
    onChangeVideoPlaying={action("CHANGE_VIDEO_PLAYING", "isPlaying")}
    onRegionClassAdded={onRegionClassAdded}
    allowComments={state.allowComments}
    hideNotEditingLabel={hideNotEditingLabel}
    allowedGroups={allowedGroups}
  />
)

const onClickIconSidebarItem = useEventCallback((item) => {
  dispatch({ type: "SELECT_TOOL", selectedTool: item.name })
})

const onClickHeaderItem = useEventCallback((item) => {
  if (item.name === "Fullscreen") {
    fullScreenHandle.enter()
  } else if (item.name === "Window") {
    fullScreenHandle.exit()
  }
  dispatch({ type: "HEADER_BUTTON_CLICKED", buttonName: item.name })
})

const debugModeOn = Boolean(window.localStorage.$ANNOTATE_DEBUG_MODE && state)
const nextImageHasRegions =
  !nextImage || (nextImage.regions && nextImage.regions.length > 0)

// Editor.js blocks
const selectedGroupId = state.images[state.selectedImage]?.selectedGroupId || null;
const extractionEngineRegions = (state.images[state.selectedImage]?.regions || []).filter(r => r.cls !== 'metadata')
const editorBlocks = regionsToBlocks(extractionEngineRegions, clsColor);
const blocks = selectedGroupId === null
  ? editorBlocks
  : editorBlocks.filter(i => i?.data?.groupId === selectedGroupId);

const handleEditorChange = ({ imageIndex, data }) => {
  const newRegions = data.blocks.map(i => ({
    id: i.id,
    cls: i.data.labelName,
    text: i.data.text
  }))
  dispatch({ type: "UPDATE_REGIONS", regions: newRegions, imageIndex })
}

const pages = state.images.map((i, idx) => ({
  id: `${i.id}`,
  src: i.thumbnail,
  isActive: idx === state.selectedImage,
  pageNumber: i?.metadata?.find(md => md.key === "pageNumber")?.value || null,
  metadata: i.metadata || [],
  lockedUntil: i.lockedUntil,
  syncError: i.syncError || null,
  isRecalcReady: intersection(reacalcActionsEnum, state.images[idx].saveableActions).length > 0
}))

const handlePageClick = (pageIndex) => {
  dispatch({ type: "SELECT_IMAGE", imageIndex: pageIndex })
}

const isSelectedImageLocked = state.images[state.selectedImage]?.lockedUntil ? true : false;
const selectedFrame = state.images[state.selectedImage]?.regions.find(i => i.highlighted === true)?.id || '';

return (
  <ThemeProvider theme={theme}>
    <FullScreenContainer>
      <FullScreen
        handle={fullScreenHandle}
        onChange={(open) => {
          if (!open) {
            fullScreenHandle.exit()
            action("HEADER_BUTTON_CLICKED", "buttonName")("Window")
          }
        }}
      >
        <GlobalHotKeys
          allowChanges
          keyMap={defaultKeyMap}
          handlers={guardedHotkeyHandlers}
        />
        <HotkeyDiv
          tabIndex={-1}
          divRef={innerContainerRef}
          onMouseDown={refocusOnMouseEvent}
          onKeyDownCapture={preventEnterActivatingButtons}
          allowChanges
          keyMap={defaultKeyMap}
          handlers={guardedHotkeyHandlers}
          className={classnames(
            classes.container,
            state.fullScreen && "Fullscreen"
          )}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'row'
          }}>
            {
              showPageSelector && (
                <PageSelector
                  pages={pages}
                  onPageClick={handlePageClick}
                  onMetadataChange={onMetadataChange}
                  metadataConfigs={state.metadataConfigs || []}
                  onRecalcClick={onRecalcClick}
                  updatedBy={updatedBy}
                  mediaPresenterLeaseUntil={mediaPresenterLeaseUntil}
                  humanProcessorConfirmation={humanProcessorConfirmation}
                  onHumanProcessorConfirmationChange={onHumanProcessorConfirmationChange}
                />
              )
            }
            <WorkspaceWrapper >
              <Workspace
                style={{
                  width: "auto",
                }}
                allowFullscreen
                iconDictionary={iconDictionary}
                hideHeader={hideHeader}
                hideHeaderText={hideHeaderText}
                headerLeftSide={[
                  state.annotationType === "video" ? (
                    <KeyframeTimeline
                      currentTime={state.currentVideoTime}
                      duration={state.videoDuration}
                      onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
                      keyframes={state.keyframes}
                    />
                  ) : activeImage ? (
                    <div className={classes.headerTitle}>{activeImage.name}</div>
                  ) : null,
                ].filter(Boolean)}
                headerItems={[
                  !hidePrev && { name: "Prev" },
                  !hideNext && { name: "Next" },
                  state.annotationType !== "video"
                    ? null
                    : !state.videoPlaying
                      ? { name: "Play" }
                      : { name: "Pause" },
                  !hideClone &&
                  !nextImageHasRegions &&
                  activeImage.regions && { name: "Clone" },
                  !hideSettings && { name: "Settings" },
                  !hideFullScreen &&
                  (state.fullScreen
                    ? { name: "Window" }
                    : { name: "Fullscreen" }),
                  !hideSave && { name: "Save" },
                ].filter(Boolean)}
                onClickHeaderItem={onClickHeaderItem}
                onClickIconSidebarItem={onClickIconSidebarItem}
                selectedTools={[
                  state.selectedTool,
                  state.showTags && "show-tags",
                  state.showMask && "show-mask",
                ].filter(Boolean)}
                iconSidebarItems={!state.enabledTools ? [] : [
                  {
                    name: "select",
                    helperText: "Select" + getHotkeyHelpText("select_tool"),
                    alwaysShowing: false,
                  },
                  {
                    name: "pan",
                    helperText:
                      "Drag/Pan (right or middle click)" +
                      getHotkeyHelpText("pan_tool"),
                    alwaysShowing: false,
                  },
                  {
                    name: "zoom",
                    helperText:
                      "Zoom In/Out (scroll)" + getHotkeyHelpText("zoom_tool"),
                    alwaysShowing: false,
                  },
                  {
                    name: "show-tags",
                    helperText: "Show / Hide Tags",
                    alwaysShowing: false,
                  },
                  {
                    name: "create-point",
                    helperText: "Add Point" + getHotkeyHelpText("create_point"),
                  },
                  {
                    name: "create-box",
                    helperText:
                      "Add Bounding Box" +
                      getHotkeyHelpText("create_bounding_box"),
                  },
                  {
                    name: "create-polygon",
                    helperText:
                      "Add Polygon" + getHotkeyHelpText("create_polygon"),
                  },
                  {
                    name: "create-line",
                    helperText: "Add Line",
                  },
                  {
                    name: "create-expanding-line",
                    helperText: "Add Expanding Line",
                  },
                  {
                    name: "create-keypoints",
                    helperText: "Add Keypoints (Pose)",
                  },
                  state.fullImageSegmentationMode && {
                    name: "show-mask",
                    alwaysShowing: false,
                    helperText: "Show / Hide Mask",
                  },
                  {
                    name: "modify-allowed-area",
                    helperText: "Modify Allowed Area",
                  },
                ]
                  .filter(Boolean)
                  .filter(
                    (a) => a.alwaysShowing || state.enabledTools.includes(a.name)
                  )}
                rightSidebarItems={[
                  <RightSidebarItemsWrapper>
                    {
                      [
                        isSelectedImageLocked && (<Locker />),
                        debugModeOn && (
                          <DebugBox state={debugModeOn} lastAction={state.lastAction} key="debug-box" />
                        ),
                        state.taskDescription && (
                          <TaskDescription description={state.taskDescription} key="task-description" />
                        ),
                        state.help && (
                          <Help help={state.help} key="help" />
                        ),
                        state.regionClsList && (
                          <ClassSelectionMenu
                            selectedCls={state.selectedCls}
                            regionClsList={state.regionClsList}
                            onSelectCls={action("SELECT_CLASSIFICATION", "cls")}
                            key="class-selection-menu"
                          />
                        ),
                        state.labelImages && (
                          <TagsSidebarBox
                            currentImage={activeImage}
                            imageClsList={state.imageClsList}
                            imageTagList={state.imageTagList}
                            onChangeImage={action("CHANGE_IMAGE", "delta")}
                            expandedByDefault
                            key="tags-sidebar-box"
                          />
                        ),
                        // (state.images?.length || 0) > 1 && (
                        //   <ImageSelector
                        //     onSelect={action("SELECT_REGION", "region")}
                        //     images={state.images}
                        //   />
                        // ),
                        // groups && (
                        //   <GroupSelector
                        //     title="Articles"
                        //     groups={groups}
                        //     selectedGroupId={selectedGroupId}
                        //     onSelect={onGroupSelect}
                        //   />
                        // )
                        ,
                        <RegionSelector
                          regions={activeImage ? activeImage.regions : emptyArr}
                          onSelectRegion={action("SELECT_REGION", "region")}
                          onDeleteRegion={action("DELETE_REGION", "region")}
                          onDeleteAllRegions={action("DELETE_ALL_REGIONS")}
                          onChangeRegion={action("CHANGE_REGION", "region")}
                          key="region-selector"
                        />,
                        state.keyframes && (
                          <KeyframesSelector
                            onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
                            onDeleteKeyframe={action("DELETE_KEYFRAME", "time")}
                            onDeleteAllKeyframes={action("DELETE_ALL_KEYFRAMES")}
                            onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
                            currentTime={state.currentVideoTime}
                            duration={state.videoDuration}
                            keyframes={state.keyframes}
                            key="key-frame-selector"
                          />
                        ),
                        !hideHistory && (
                          <HistorySidebarBox
                            history={state.history}
                            onRestoreHistory={action("RESTORE_HISTORY")}
                            key="history-sidebar"
                          />
                        ),
                        <MetadataEditor state={state} onMetadataChange={onMetadataChange} key="metadata-editor" />,
                        <GroupsEditor groups={allowedGroups} onAddGroup={onAddGroup} key="groups-editor" />,
                      ].filter(Boolean)
                    }
                  </RightSidebarItemsWrapper>
                ]}
              >
                {
                  isSelectedImageLocked && (<Locker />)
                }
                {canvas}
              </Workspace>
            </WorkspaceWrapper>
            {
              (showEditor && !isSelectedImageLocked) && (
                <EditorWrapper id="editor-wrapper">
                  <Editor id="editor" blocks={blocks} imageIndex={state.selectedImage} key={`${state.selectedImage}#${selectedGroupId}`} selectedFrame={selectedFrame} onChange={handleEditorChange} />
                </EditorWrapper>
              )
            }
          </div>
          <SettingsDialog
            open={state.settingsOpen}
            onClose={() =>
              dispatch({
                type: "HEADER_BUTTON_CLICKED",
                buttonName: "Settings",
              })
            }
          />
        </HotkeyDiv>
      </FullScreen>
    </FullScreenContainer>
  </ThemeProvider >
)
}

export default MainLayout
