// @flow weak

import React from "react"
import AddLocationIcon from "@material-ui/icons/AddLocation"
import SidebarBoxContainer from "../SidebarBoxContainer"
import * as colors from "@material-ui/core/colors"
import getTimeString from "../KeyframeTimeline/get-time-string.js"

const KeyframesSelector = ({ keyframes, onChangeVideoTime }) => {
  const keyframeTimes = Object.keys(keyframes).map(t => parseInt(t))
  return (
    <SidebarBoxContainer
      title="Keyframes"
      subTitle=""
      icon={<AddLocationIcon style={{ color: colors.grey[700] }} />}
      expandedByDefault
    >
      {keyframeTimes.map(t => (
        <div key={t}>{getTimeString(t)}</div>
      ))}
    </SidebarBoxContainer>
  )
}

export default KeyframesSelector
