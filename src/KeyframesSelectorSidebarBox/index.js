// @flow weak

import React from "react"
import AddLocationIcon from "@material-ui/icons/AddLocation"
import SidebarBoxContainer from "../SidebarBoxContainer"
import * as colors from "@material-ui/core/colors"
import getTimeString from "../KeyframeTimeline/get-time-string.js"
import TrashIcon from "@material-ui/icons/Delete"
import { styled } from "@material-ui/core/styles"

const KeyframeRow = styled("div")({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: 8,
  fontSize: 14,
  color: colors.grey[700],
  "&.current": {
    backgroundColor: colors.blue[100],
  },
  "&:hover": {
    backgroundColor: colors.grey[100],
  },
  "& .time": {
    flexGrow: 1,
    fontWeight: "bold",
    "& .regionCount": {
      marginLeft: 8,
      fontWeight: "normal",
      color: colors.grey[500],
    },
  },
  "& .trash": {
    "& .icon": {
      fontSize: 18,
      color: colors.grey[600],
      transition: "transform 80ms",
      "&:hover": {
        color: colors.grey[800],
        transform: "scale(1.25,1.25)",
      },
    },
  },
})

const KeyframesSelectorSidebarBox = ({
  currentVideoTime,
  keyframes,
  onChangeVideoTime,
  onDeleteKeyframe,
}) => {
  const keyframeTimes = Object.keys(keyframes).map((t) => parseInt(t))

  return (
    <SidebarBoxContainer
      title="Keyframes"
      subTitle=""
      icon={<AddLocationIcon style={{ color: colors.grey[700] }} />}
      expandedByDefault
    >
      {keyframeTimes.map((t) => (
        <KeyframeRow
          fullWidth
          key={t}
          className={currentVideoTime === t ? "current" : ""}
          onClick={() => onChangeVideoTime(t)}
        >
          <div className="time">
            {getTimeString(t, 2)}
            <span className="regionCount">
              ({(keyframes[t]?.regions || []).length})
            </span>
          </div>
          <div className="trash">
            <TrashIcon
              onClick={(e) => {
                onDeleteKeyframe(t)
                e.stopPropagation()
              }}
              className="icon"
            />
          </div>
        </KeyframeRow>
      ))}
    </SidebarBoxContainer>
  )
}

export default KeyframesSelectorSidebarBox
