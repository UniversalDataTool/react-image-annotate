// @flow

import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import HeaderButton, { HeaderButtonContext } from "../HeaderButton"
import BackIcon from "@material-ui/icons/KeyboardArrowLeft"
import NextIcon from "@material-ui/icons/KeyboardArrowRight"
import SettingsIcon from "@material-ui/icons/Settings"
import HelpIcon from "@material-ui/icons/Help"
import FullscreenIcon from "@material-ui/icons/Fullscreen"
import ExitIcon from "@material-ui/icons/ExitToApp"
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext"
import HotkeysIcon from "@material-ui/icons/Keyboard"
import styles from "./styles"

const useStyles = makeStyles(styles)

type Props = {
  onHeaderButtonClick: string => any,
  title: string,
  inFullScreen?: boolean,
  multipleImages?: boolean,
  isAVideoFrame?: boolean
}

export const Header = ({
  onHeaderButtonClick,
  title,
  inFullScreen,
  isAVideoFrame = false,
  nextVideoFrameHasRegions = false,
  multipleImages
}: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.header}>
      <div className={classes.fileInfo}>{title}</div>
      <div className={classes.headerActions}>
        <HeaderButtonContext.Provider value={{ onHeaderButtonClick }}>
          {multipleImages && (
            <>
              <HeaderButton name="Prev" Icon={BackIcon} />
              <HeaderButton name="Next" Icon={NextIcon} />
              <HeaderButton
                name="Clone"
                disabled={nextVideoFrameHasRegions}
                Icon={QueuePlayNextIcon}
              />
            </>
          )}
          <HeaderButton name="Settings" Icon={SettingsIcon} />
          {/* <HeaderButton name="Help" Icon={HelpIcon} /> */}
          {inFullScreen ? (
            <HeaderButton name="Window" Icon={FullscreenIcon} />
          ) : (
            <HeaderButton name="Fullscreen" Icon={FullscreenIcon} />
          )}
          {/* <HeaderButton name="Hotkeys" Icon={HotkeysIcon} /> */}
          <HeaderButton name="Save" Icon={ExitIcon} />
        </HeaderButtonContext.Provider>
      </div>
    </div>
  )
}

export default Header
