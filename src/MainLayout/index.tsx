// @flow

import { Action, AnnotatorToolEnum, MainLayoutState } from "./types";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  ComponentType,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

import ClassSelectionMenu from "../ClassSelectionMenu";
import DebugBox from "../DebugSidebarBox";
import HistorySidebarBox from "../HistorySidebarBox";
import ImageCanvas from "../ImageCanvas";
import KeyframeTimeline from "../KeyframeTimeline";
import KeyframesSelector from "../KeyframesSelectorSidebarBox";
import RegionSelector from "../RegionSelectorSidebarBox";
import TagsSidebarBox from "../TagsSidebarBox";
import TaskDescription from "../TaskDescriptionSidebarBox";
import classnames from "classnames";
import getActiveImage from "../Annotator/reducers/get-active-image";
import iconDictionary from "./icon-dictionary";
import { useDispatchHotkeyHandlers } from "../ShortcutsManager";
import useEventCallback from "use-event-callback";
import useImpliedVideoRegions from "./use-implied-video-regions";
import { useKey } from "../utils/use-key-hook";
import { useSettings } from "../SettingsProvider";
import { HotKeys } from "react-hotkeys";
import { grey } from "@mui/material/colors";
import { notEmpty } from "../utils/not-empty.ts";
import { ALL_TOOLS } from "./all-tools-list.ts";
import Immutable from "seamless-immutable";
import Workspace from "../workspace/Workspace";
import { tss } from "tss-react/mui";
import { RegionLabelProps } from "../RegionLabel";
import SettingsDialog from "../SettingsDialog";

// import Fullscreen from "../Fullscreen"

const theme = createTheme();
const useStyles = tss.create({
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    height: "100%",
    maxHeight: "100vh",
    backgroundColor: "#fff",
    overflow: "hidden",
    "&.fullscreen": {
      position: "absolute",
      zIndex: 99999,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  headerTitle: {
    fontWeight: "bold",
    color: grey[700],
    paddingLeft: 16,
  },
});

const FullScreenContainer = styled("div")(() => ({
  width: "100%",
  height: "100%",
  "& .fullscreen": {
    width: "100%",
    height: "100%",
  },
}));

type Props = {
  state: MainLayoutState;
  RegionEditLabel?:
    | ComponentType<RegionLabelProps>
    | FunctionComponent<RegionLabelProps>
    | null;
  dispatch: (action: Action) => void;
  alwaysShowNextButton?: boolean;
  alwaysShowPrevButton?: boolean;
  onRegionClassAdded: (cls: string) => void;
  hideHeader?: boolean;
  hideHeaderText?: boolean;
  hideNext?: boolean;
  hidePrev?: boolean;
  hideClone?: boolean;
  hideSettings?: boolean;
  hideFullScreen?: boolean;
  hideSave?: boolean;
};

export const MainLayout = ({
  state,
  dispatch,
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
}: Props) => {
  const { classes } = useStyles();
  const settings = useSettings();
  const fullScreenHandle = useFullScreenHandle();

  const memoizedActionFns = useRef<Record<string, (...args: any[]) => void>>(
    {}
  );
  const action = (type: Action["type"], ...params: Array<any>) => {
    const fnKey = `${type}(${params.join(",")})`;
    if (memoizedActionFns.current[fnKey])
      return memoizedActionFns.current[fnKey];

    const fn = (...args: any) =>
      params.length > 0
        ? dispatch({
            type,
            ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {}),
          })
        : dispatch({ type, ...args[0] });
    memoizedActionFns.current[fnKey] = fn;
    return fn;
  };

  const { currentImageIndex, activeImage } = getActiveImage(Immutable(state));
  let nextImage;
  if (currentImageIndex !== null && "images" in state) {
    nextImage = state.images[+currentImageIndex + 1];
  }

  useKey(() => dispatch({ type: "CANCEL" }), {
    detectKeys: [27],
  });

  // const isAVideoFrame = activeImage && activeImage.frameTime !== undefined
  const innerContainerRef = useRef<HTMLElement | null>(null);
  const hotkeyHandlers = useDispatchHotkeyHandlers({ dispatch });

  let impliedVideoRegions = useImpliedVideoRegions(state);

  const refocusOnMouseEvent: MouseEventHandler<HotKeys> = useCallback(
    (e: MouseEvent<HotKeys>) => {
      const target = e.target as HTMLElement;
      if (!innerContainerRef.current) return;
      if (innerContainerRef.current.contains(document.activeElement)) return;
      if (innerContainerRef.current.contains(target)) {
        innerContainerRef.current.focus();
        target.focus();
      }
    },
    []
  );

  const canvas = (
    <ImageCanvas
      {...settings}
      showCrosshairs={
        settings.showCrosshairs &&
        !["select", "pan", "zoom"].includes(state.selectedTool)
      }
      key={
        state.annotationType === "image" ? state.selectedImage : state.videoSrc
      }
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={state.showTags}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={state.regionClsList}
      regionTagList={state.regionTagList}
      regionTagSingleSelection={state.regionTagSingleSelection}
      regions={
        state.annotationType === "image"
          ? activeImage?.regions || []
          : impliedVideoRegions
      }
      realSize={
        activeImage && "realSize" in activeImage
          ? activeImage.realSize
          : undefined
      }
      videoPlaying={"videoPlaying" in state ? state.videoPlaying : false}
      imageSrc={
        state.annotationType === "image" && activeImage && "src" in activeImage
          ? activeImage.src
          : null
      }
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
      onBeginBoxTransform={action("BEGIN_BOX_TRANSFORM", "box", "directions")}
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
      RegionEditLabel={RegionEditLabel}
      onImageOrVideoLoaded={action("IMAGE_OR_VIDEO_LOADED", "metadata")}
      onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
      onChangeVideoPlaying={action("CHANGE_VIDEO_PLAYING", "isPlaying")}
      onRegionClassAdded={onRegionClassAdded}
      allowComments={state.allowComments}
    />
  );

  const onClickIconSidebarItem = useEventCallback((item) => {
    dispatch({ type: "SELECT_TOOL", selectedTool: item.name });
  });

  const onClickHeaderItem = useEventCallback((item: { name: string }) => {
    const btnName = item.name.toLowerCase();
    if (btnName === "fullscreen") {
      fullScreenHandle.enter();
    } else if (btnName === "window") {
      fullScreenHandle.exit();
    }
    dispatch({
      type: "HEADER_BUTTON_CLICKED",
      buttonName: item.name,
    });
  });

  const debugModeOn = Boolean(
    window.localStorage.$ANNOTATE_DEBUG_MODE && state
  );
  const nextImageHasRegions =
    !nextImage || (nextImage.regions && nextImage.regions.length > 0);

  const headerItems = useMemo(
    () =>
      [
        !hidePrev && { name: "Prev" },
        !hideNext && { name: "Next" },
        state.annotationType !== "video"
          ? null
          : !state.videoPlaying
          ? { name: "Play" }
          : { name: "Pause" },
        !hideClone &&
          !nextImageHasRegions &&
          activeImage?.regions && { name: "Clone" },
        !hideSettings && { name: "Settings" },
        !hideFullScreen &&
          (state.fullScreen ? { name: "Window" } : { name: "Fullscreen" }),
        !hideSave && { name: "Save" },
      ].reduce((acc: { name: string }[], curr) => {
        if (curr) {
          acc.push(curr);
        }
        return acc;
      }, []),
    [
      state.fullScreen,
      state.annotationType,
      hidePrev,
      hideNext,
      hideClone,
      hideSettings,
      hideFullScreen,
      hideSave,
    ]
  );

  const allSidebarIcons = ALL_TOOLS.filter((a) => {
    if (a.name === "show-mask") {
      return state.fullImageSegmentationMode;
    }
    return (
      "alwaysShowing" in a ||
      state.enabledTools.includes(a.name as AnnotatorToolEnum)
    );
  });

  const headerLeftSide: ReactElement[] = [
    state.annotationType === "video" ? (
      <KeyframeTimeline
        key="KeyframeTimeline"
        currentTime={state.currentVideoTime}
        duration={state.videoDuration}
        onChangeCurrentTime={action("CHANGE_VIDEO_TIME", "newTime")}
        keyframes={state.keyframes}
      />
    ) : activeImage ? (
      <div key="active-item-name" className={classes.headerTitle}>
        {"name" in activeImage ? activeImage.name : ""}
      </div>
    ) : null,
  ].filter(notEmpty);

  const rightSidebarItems = [
    debugModeOn && (
      <DebugBox key="debuxBox" state={state} lastAction={state.lastAction} />
    ),
    state.taskDescription && (
      <TaskDescription
        key="taskDescription"
        description={state.taskDescription}
      />
    ),
    state.regionClsList && (
      <ClassSelectionMenu
        key="classSelectionMenu"
        selectedCls={state.selectedCls}
        regionClsList={state.regionClsList}
        onSelectCls={action("SELECT_CLASSIFICATION", "cls")}
      />
    ),
    state.annotationType === "image" && state.labelImages && (
      <TagsSidebarBox
        key="tagsSidebarBox"
        currentImage={activeImage}
        imageClsList={state.imageClsList}
        imageTagList={state.imageTagList}
        onChangeImage={action("CHANGE_IMAGE", "delta")}
        expandedByDefault
      />
    ),
    <RegionSelector
      key="regionSelector"
      regionClsList={state.regionClsList}
      regions={activeImage ? activeImage.regions : []}
      regionAllowedActions={state.regionAllowedActions}
      onSelectRegion={action("SELECT_REGION", "region")}
      onDeleteRegion={action("DELETE_REGION", "region")}
      onChangeRegion={action("CHANGE_REGION", "region")}
    />,
    state.annotationType === "video" && state.keyframes && (
      <KeyframesSelector
        key="keyframesSelector"
        onChangeVideoTime={action("CHANGE_VIDEO_TIME", "newTime")}
        onDeleteKeyframe={action("DELETE_KEYFRAME", "time")}
        currentVideoTime={state.currentVideoTime}
        keyframes={state.keyframes}
      />
    ),
    <HistorySidebarBox
      key="historySidebarBox"
      history={state.history}
      onRestoreHistory={action("RESTORE_HISTORY")}
    />,
  ].reduce((acc: ReactElement[], curr) => {
    if (curr) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <FullScreenContainer>
        <FullScreen
          handle={fullScreenHandle}
          onChange={(open) => {
            if (!open) {
              fullScreenHandle.exit();
              action("HEADER_BUTTON_CLICKED", "buttonName")("window");
            }
          }}
        >
          <HotKeys
            tabIndex={-1}
            innerRef={innerContainerRef}
            onMouseDown={refocusOnMouseEvent}
            onMouseOver={refocusOnMouseEvent}
            allowChanges
            handlers={hotkeyHandlers}
            className={classnames(
              classes.container,
              state.fullScreen && "Fullscreen"
            )}
          >
            <Workspace
              allowFullscreen
              iconDictionary={iconDictionary}
              hideHeader={hideHeader}
              hideHeaderText={hideHeaderText}
              headerLeftSide={headerLeftSide}
              headerItems={headerItems}
              onClickHeaderItem={onClickHeaderItem}
              onClickIconSidebarItem={onClickIconSidebarItem}
              selectedTools={
                [
                  state.selectedTool,
                  state.showTags && "show-tags",
                  state.showMask && "show-mask",
                ].filter(Boolean) as AnnotatorToolEnum[]
              }
              iconSidebarItems={allSidebarIcons}
              rightSidebarItems={rightSidebarItems}
            >
              {canvas}
            </Workspace>
            <SettingsDialog
              open={state.settingsOpen || false}
              onClose={() =>
                dispatch({
                  type: "HEADER_BUTTON_CLICKED",
                  buttonName: "Settings",
                })
              }
            />
          </HotKeys>
        </FullScreen>
      </FullScreenContainer>
    </ThemeProvider>
  );
};

export default MainLayout;
