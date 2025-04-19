import {
  Action,
  AnnotatorToolEnum,
  Image,
  MainLayoutState,
  RegionAllowedActions,
} from "../MainLayout/types.ts";
import { ComponentType, forwardRef, FunctionComponent, useEffect, useImperativeHandle, useReducer, useRef } from "react";

import type { KeypointsDefinition } from "../types/region-tools.ts";
import MainLayout, { MainLayoutRef } from "../MainLayout/index.tsx";
import SettingsProvider from "../SettingsProvider/index.tsx";
import combineReducers from "./reducers/combine-reducers.ts";
import generalReducer from "./reducers/general-reducer.ts";
import getFromLocalStorage from "../utils/get-from-local-storage.ts";
import historyHandler from "./reducers/history-handler.ts";
import imageReducer from "./reducers/image-reducer.ts";
import useEventCallback from "use-event-callback";
import { AutosegOptions } from "autoseg/webworker";
import { produce } from "immer";

export type AnnotatorProps = {
  taskDescription?: string;
  allowedArea?: { x: number; y: number; w: number; h: number };
  regionTagList?: Array<string>;
  regionTagSingleSelection?: boolean;
  regionAllowedActions?: Partial<RegionAllowedActions>;
  regionClsList?: Array<string | { id: string; label: string; color: string }>;
  imageTagList?: Array<string>;
  imageClsList?: Array<string>;
  enabledTools?: Array<AnnotatorToolEnum>;
  selectedTool?: String;
  showTags?: boolean;
  selectedCls?: string;
  selectedImage?: string | number;
  images?: Array<Image>;
  showPointDistances?: boolean;
  pointDistancePrecision?: number;
  RegionEditLabel?: ComponentType<any> | FunctionComponent<any> | null;
  onExit: (state: MainLayoutState) => void;
  keypointDefinitions?: KeypointsDefinition;
  fullImageSegmentationMode?: boolean;
  autoSegmentationOptions?: AutosegOptions;
  hideHeader?: boolean;
  hideHeaderText?: boolean;
  hideNext?: boolean;
  hidePrev?: boolean;
  hideClone?: boolean;
  hideSettings?: boolean;
  hideFullScreen?: boolean;
  hideSave?: boolean;
  allowComments?: boolean;
  customeHeaderItem?: {
    icon: React.ReactNode,
    name: string,
    onClickAction: () => void
  }
  onNextImage?: (state: MainLayoutState) => void;
  onPrevImage?: (state: MainLayoutState) => void;
};

export type AnnotatorRef = {
  clickHeaderButton: (name: string) => void;
}

export const Annotator = forwardRef<AnnotatorRef, AnnotatorProps>(({
  images,
  allowedArea,
  selectedImage = images && images.length > 0 ? 0 : undefined,
  showPointDistances,
  pointDistancePrecision,
  showTags = getFromLocalStorage("showTags", true),
  selectedCls,
  enabledTools = [
    "select",
    "create-point",
    "create-box",
    "create-polygon",
    "create-line",
    "create-expanding-line",
    "show-mask",
  ],
  selectedTool = "create-box",
  regionTagSingleSelection = false,
  regionTagList = [],
  regionClsList = [],
  regionAllowedActions = {
    remove: true,
    lock: true,
    visibility: true,
  },
  imageTagList = [],
  imageClsList = [],
  taskDescription = "",
  fullImageSegmentationMode = false,
  RegionEditLabel,
  onExit,
  onNextImage,
  onPrevImage,
  autoSegmentationOptions = { type: "autoseg" },
  hideHeader,
  hideHeaderText,
  hideNext,
  hidePrev,
  hideClone,
  hideSettings,
  hideFullScreen,
  hideSave,
  allowComments,
  customeHeaderItem
}, ref) => {
  if (typeof selectedImage === "string") {
    selectedImage = (images || []).findIndex(
      (img) => img.name === selectedImage
    );

    if (selectedImage === -1) selectedImage = undefined;
  }

  const mainLayoutRef = useRef<MainLayoutRef>(null);
    
  useImperativeHandle(ref, () => ({
    clickHeaderButton(name: string) {
      mainLayoutRef.current?.clickHeaderButton(name);
    },
  }));

  const combinedReducers = combineReducers(imageReducer, generalReducer) as (
    state: MainLayoutState,
    action: Action
  ) => MainLayoutState;

  const immutableState = {
    showTags,
    selectedCls,
    allowedArea,
    showPointDistances,
    pointDistancePrecision,
    selectedTool,
    fullImageSegmentationMode: fullImageSegmentationMode,
    autoSegmentationOptions,
    mode: null,
    taskDescription,
    showMask: true,
    labelImages: imageClsList.length > 0 || imageTagList.length > 0,
    regionClsList,
    regionTagList,
    regionTagSingleSelection,
    imageClsList,
    imageTagList,
    enabledTools,
    history: [],
    allowComments,
    regionAllowedActions: {
      remove: regionAllowedActions?.remove ?? true,
      lock: regionAllowedActions?.lock ?? true,
      visibility: regionAllowedActions?.visibility ?? true,
    },
    ...{
      selectedImage,
      images,
    },
  };
  const [state, dispatchToReducer] = useReducer(
    historyHandler(combinedReducers) as unknown as (
      state: MainLayoutState,
      action: Action
    ) => MainLayoutState,
    immutableState as unknown as MainLayoutState
  );

  const dispatch = useEventCallback((action: Action) => {
    if (action.type === "HEADER_BUTTON_CLICKED") {
      if (["Exit", "Done", "Save", "Complete"].includes(action.buttonName)) {
        return onExit(produce(state, s => {s.history.splice(0)}));
      } else if (action.buttonName === "Next" && onNextImage) {
        return onNextImage(produce(state, s => {s.history.splice(0)}));
      } else if (action.buttonName === "Prev" && onPrevImage) {
        return onPrevImage(produce(state, s => {s.history.splice(0)}));
      }
    }
    dispatchToReducer(action);
  });

  const onRegionClassAdded = useEventCallback((cls) => {
    dispatchToReducer({
      type: "ON_CLS_ADDED",
      cls: cls,
    });
  });

  useEffect(() => {
    if (selectedImage === undefined) return;
    const image = state.images[selectedImage];
    dispatchToReducer({
      type: "SELECT_IMAGE",
      imageIndex: +selectedImage,
      image,
    });
    // @ts-ignore
  }, [selectedImage, state.images]);

  if (!images) return <div>Missing required "images"</div>;

  return (
    <SettingsProvider>
      <MainLayout
        ref={mainLayoutRef}
        RegionEditLabel={RegionEditLabel}
        alwaysShowNextButton={Boolean(onNextImage)}
        alwaysShowPrevButton={Boolean(onPrevImage)}
        state={state}
        dispatch={dispatch}
        onRegionClassAdded={onRegionClassAdded}
        hideHeader={hideHeader}
        hideHeaderText={hideHeaderText}
        hideNext={hideNext}
        hidePrev={hidePrev}
        hideClone={hideClone}
        hideSettings={hideSettings}
        hideFullScreen={hideFullScreen}
        hideSave={hideSave}
        customeHeaderItem={customeHeaderItem}
      />
    </SettingsProvider>
  );
});

export default Annotator;
