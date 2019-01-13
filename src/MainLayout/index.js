// @flow

import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/styles"
import Sidebar from "../Sidebar"
import ImageCanvas from "../ImageCanvas"
import Header from "../Header"
import IconTools from "../IconTools"
import styles from "./styles"
import type { MainLayoutState, Action } from "./types"
import useKey from "use-key-hook"

const useStyles = makeStyles(styles)

type Props = {
  state: MainLayoutState,
  dispatch: Action => null
}

export default ({ state, dispatch }: Props) => {
  const classes = useStyles()

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
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <Header
          onHeaderButtonClick={action("HEADER_BUTTON_CLICKED", "buttonName")}
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
            <ImageCanvas
              key={state.selectedImage}
              showTags={state.showTags}
              regions={currentImage ? currentImage.regions || [] : []}
              imageSrc={state.selectedImage}
              createWithPrimary={state.selectedTool.includes("create")}
              dragWithPrimary={state.selectedTool === "pan"}
              zoomWithPrimary={state.selectedTool === "zoom"}
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
            />
          )}
        </div>
        <div className={classes.sidebarContainer}>
          <Sidebar
            debug={state}
            taskDescription={state.taskDescription}
            images={state.images}
            regions={currentImage ? currentImage.regions || [] : []}
            history={state.history}
            onSelectRegion={action("SELECT_REGION", "region")}
            onDeleteRegion={action("DELETE_REGION", "region")}
            onSelectImage={action("SELECT_IMAGE", "image")}
            onChangeRegion={action("CHANGE_REGION", "region")}
            onRestoreHistory={action("RESTORE_HISTORY")}
          />
        </div>
      </div>
    </div>
  )
}
