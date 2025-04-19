

import { Action, AnnotatorToolEnum, MainLayoutState } from "./types.ts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  ComponentType,
  forwardRef,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

import ClassSelectionMenu from "../ClassSelectionMenu/index.tsx";
import DebugBox from "../DebugSidebarBox/index.tsx";
import HistorySidebarBox from "../HistorySidebarBox/index.tsx";
import ImageCanvas from "../ImageCanvas/index.tsx";
import RegionSelector from "../RegionSelectorSidebarBox/index.tsx";
import TagsSidebarBox from "../TagsSidebarBox/index.tsx";
import TaskDescription from "../TaskDescriptionSidebarBox/index.tsx";
import classnames from "classnames";
import getActiveImage from "../Annotator/reducers/get-active-image.ts";
import iconDictionary from "./icon-dictionary.tsx";
import { useDispatchHotkeyHandlers } from "../ShortcutsManager/index.tsx";
import useEventCallback from "use-event-callback";
import { useKey } from "../utils/use-key-hook.ts";
import { useSettings } from "../SettingsProvider/index.tsx";
import { HotKeys } from "react-hotkeys";
import { grey } from "@mui/material/colors";
import { notEmpty } from "../utils/not-empty.ts";
import { ALL_TOOLS } from "./all-tools-list.ts";
import Workspace, { WorkspaceRef } from "../workspace/Workspace/index.tsx";
import { tss } from "tss-react/mui";
import { RegionLabelProps } from "../RegionLabel/index.tsx";
import SettingsDialog from "../SettingsDialog/index.tsx";

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
  customeHeaderItem?: {
    icon: React.ReactNode,
    name: string,
    onClickAction: () => void
  }
};

export interface MainLayoutRef {
  clickHeaderButton: (name: string) => void;
}

export const MainLayout = forwardRef<MainLayoutRef, Props>(({
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
  customeHeaderItem
}, ref) => {
  const { classes } = useStyles();
  const settings = useSettings();
  const fullScreenHandle = useFullScreenHandle();

  const memoizedActionFns = useRef<Record<string, (...args: any[]) => void>>(
    {}
  );

  const workSpaceRef = useRef<WorkspaceRef>(null);
  
  useImperativeHandle(ref, () => ({
    clickHeaderButton(name: string) {
      workSpaceRef.current?.clickHeaderButton(name);
    },
  }));

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

  const { currentImageIndex, activeImage } = getActiveImage(state);
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
      key={state.selectedImage}
      showMask={state.showMask}
      fullImageSegmentationMode={state.fullImageSegmentationMode}
      autoSegmentationOptions={state.autoSegmentationOptions}
      showTags={state.showTags}
      allowedArea={state.allowedArea}
      modifyingAllowedArea={state.selectedTool === "modify-allowed-area"}
      regionClsList={state.regionClsList}
      regionTagList={state.regionTagList}
      regionTagSingleSelection={state.regionTagSingleSelection}
      regions={activeImage?.regions || []}
      realSize={
        activeImage && "realSize" in activeImage
          ? activeImage.realSize
          : undefined
      }
      imageSrc={activeImage && "src" in activeImage ? activeImage.src : null}
      pointDistancePrecision={state.pointDistancePrecision}
      createWithPrimary={state.selectedTool.includes("create")}
      dragWithPrimary={state.selectedTool === "pan"}
      zoomWithPrimary={state.selectedTool === "zoom"}
      showPointDistances={state.showPointDistances}
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
      onImageLoaded={action("IMAGE_LOADED", "metadata")}
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
    activeImage ? (
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
    state.labelImages && (
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
						// @ts-ignore
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
              ref={workSpaceRef}
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
              customeHeaderItem={customeHeaderItem}
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
});

export default MainLayout;
