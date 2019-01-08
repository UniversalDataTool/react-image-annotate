// @flow

import React from "react"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/styles"
import HeaderButton from "../HeaderButton"
import BackIcon from "@material-ui/icons/KeyboardArrowLeft"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"
import SettingsIcon from "@material-ui/icons/Settings"
import HelpIcon from "@material-ui/icons/Help"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import ExitIcon from "@material-ui/icons/ExitToApp"
import HotkeysIcon from "@material-ui/icons/Keyboard"
import IconTools from "../IconTools"
import { grey } from "@material-ui/core/colors"
import Sidebar from "../Sidebar"

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    minHeight: "98vh",
    overflow: "hidden"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    zIndex: 10,
    boxShadow: "0px 3px 8px rgba(0,0,0,.1)"
  },
  fileInfo: {
    flexGrow: 1,
    alignItems: "center",
    display: "flex",
    fontWeight: "bold",
    color: grey[800],
    fontSize: 24,
    paddingLeft: 16
  },
  workspace: {
    backgroundColor: grey[200],
    flexGrow: 1,
    display: "flex",
    flexDirection: "row"
  },
  iconToolsContainer: { display: "flex" },
  imageCanvasContainer: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noImageSelected: {
    fontWeight: "bold",
    fontSize: 32,
    color: grey[500]
  },
  sidebarContainer: {
    width: 300,
    overflowY: "auto",
    backgroundColor: grey[100],
    borderLeft: `1px solid ${grey[300]}`,
    zIndex: 9,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)"
  }
})

export default () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div className={classes.fileInfo}>Seve's Desk</div>
        <div className={classes.headerActions}>
          <HeaderButton name="Prev" Icon={BackIcon} />
          <HeaderButton name="Next" Icon={NextIcon} />
          <HeaderButton name="Settings" Icon={SettingsIcon} />
          <HeaderButton name="Help" Icon={HelpIcon} />
          <HeaderButton name="Fullscreen" Icon={FullscreenIcon} />
          <HeaderButton name="Hotkeys" Icon={HotkeysIcon} />
          <HeaderButton name="Exit" Icon={ExitIcon} />
        </div>
      </div>
      <div className={classes.workspace}>
        <div className={classes.iconToolsContainer}>
          <IconTools />
        </div>
        <div className={classes.imageCanvasContainer}>
          <div className={classes.noImageSelected}>No Image Selected</div>
        </div>
        <div className={classes.sidebarContainer}>
          <Sidebar />
        </div>
      </div>
    </div>
  )
}
