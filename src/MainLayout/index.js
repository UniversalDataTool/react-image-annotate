// @flow

import React, { useState } from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Sidebar from "../Sidebar"
import ImageCanvas from "../ImageCanvas"
import Header from "../Header"
import IconTools from "../IconTools"
import styles from "./styles"
import type { MainLayoutState, Action } from "./types"
import useKey from "use-key-hook"
import classnames from "classnames"
import { useSettings } from "../SettingsProvider"
import SettingsDialog from "../SettingsDialog"
import Fullscreen from "react-full-screen"

const useStyles = makeStyles(styles)

type Props = {
  state: MainLayoutState,
  dispatch: Action => any
}

export default ({ state, dispatch }: Props) => {
  const classes = useStyles()
  const settings = useSettings()

  const action = (type: string, ...params: Array<string>) => (...args: any) =>
    params.length > 0
      ? dispatch(
          ({
            type,
            ...params.reduce((acc, p, i) => ((acc[p] = args[i]), acc), {})
          }: any)
        )
      : dispatch({ type, ...args[0] })

  const currentImage = state.images.find(img => img.src === state.selectedImage)

  useKey(() => dispatch({ type: "CANCEL" }), {
    detectKeys: [27]
  })

  return (
    <Fullscreen
      enabled={state.fullScreen}
      onChange={open => {
        if (!open) {
          action("HEADER_BUTTON_CLICKED", "buttonName")("Exit Fullscreen")
        }
      }}
    >
      <div
        className={classnames(
          classes.container,
          state.fullScreen && "Fullscreen"
        )}
      >
        <div className={classes.headerContainer}>
          <Header
            onHeaderButtonClick={action("HEADER_BUTTON_CLICKED", "buttonName")}
            inFullScreen={state.fullScreen}
            multipleImages={Boolean(state.images.length > 1)}
            title={currentImage ? currentImage.name : "No Image Selected"}
          />
        </div>
        <div className={classes.workspace}>
          <div className={classes.iconToolsContainer}>
            <IconTools
              enabledTools={state.enabledTools}
              showTags={state.showTags}
              selectedTool={state.selectedTool}
              onClickTool={action("SELECT_TOOL", "selectedTool")}
            />
          </div>
          <div className={classes.imageCanvasContainer}>
            {!state.selectedImage ? (
              <div className={classes.noImageSelected}>No Image Selected</div>
            ) : (
              <div style={{ height: "100%", width: "100%" }}>
                <ImageCanvas
                  {...settings}
                  key={state.selectedImage}
                  showTags={state.showTags}
                  allowedArea={state.allowedArea}
                  regionClsList={state.regionClsList}
                  regionTagList={state.regionTagList}
                  regions={currentImage ? currentImage.regions || [] : []}
                  realSize={currentImage ? currentImage.realSize : undefined}
                  imageSrc={state.selectedImage}
                  pointDistancePrecision={state.pointDistancePrecision}
                  createWithPrimary={state.selectedTool.includes("create")}
                  dragWithPrimary={state.selectedTool === "pan"}
                  zoomWithPrimary={state.selectedTool === "zoom"}
                  showPointDistances={state.showPointDistances}
                  pointDistancePrecision={state.pointDistancePrecision}
                  onMouseMove={action("MOUSE_MOVE")}
                  onMouseDown={action("MOUSE_DOWN")}
                  onMouseUp={action("MOUSE_UP")}
                  onChangeRegion={action("CHANGE_REGION", "region")}
                  onBeginRegionEdit={action("OPEN_REGION_EDITOR", "region")}
                  onCloseRegionEdit={action("CLOSE_REGION_EDITOR", "region")}
                  onDeleteRegion={action("DELETE_REGION", "region")}
                  onBeginBoxTransform={action(
                    "BEGIN_BOX_TRANSFORM",
                    "box",
                    "directions"
                  )}
                  onBeginMovePolygonPoint={action(
                    "BEGIN_MOVE_POLYGON_POINT",
                    "polygon",
                    "pointIndex"
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
                />
              </div>
            )}
          </div>
          <div className={classes.sidebarContainer}>
            <Sidebar
              debug={window.localStorage.$ANNOTATE_DEBUG_MODE && state}
              taskDescription={state.taskDescription}
              images={state.images}
              regions={currentImage ? currentImage.regions || [] : []}
              history={state.history}
              currentImage={currentImage}
              labelImages={state.labelImages}
              imageClsList={state.imageClsList}
              imageTagList={state.imageTagList}

              onClassAdd={action("ADD_CLASS", "newClass")}

              onChangeImage={action("CHANGE_IMAGE", "delta")}
              onSelectRegion={action("SELECT_REGION", "region")}
              onDeleteRegion={action("DELETE_REGION", "region")}
              onSelectImage={action("SELECT_IMAGE", "image")}
              onChangeRegion={action("CHANGE_REGION", "region")}
              onRestoreHistory={action("RESTORE_HISTORY")}
            />
          </div>
        </div>
        <SettingsDialog
          open={state.settingsOpen}
          onClose={() =>
            dispatch({
              type: "HEADER_BUTTON_CLICKED",
              buttonName: "Settings"
            })
          }
        />
      </div>
    </Fullscreen>
  )
}
