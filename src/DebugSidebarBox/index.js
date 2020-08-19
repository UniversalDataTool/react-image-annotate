// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"

export const DebugSidebarBox = ({ state, lastAction }: any) => {
  const image = (state.images || [])[state.selectedImage]
  const region = image
    ? (image.regions || []).filter((r) => r.highlighted)
    : null

  return (
    <SidebarBoxContainer title="Debug" icon={<span />} expandedByDefault>
      <div style={{ padding: 4 }}>
        <div>
          <b>region</b>:
        </div>
        <pre>{JSON.stringify(region, null, "  ")}</pre>
        <div>
          <b>lastAction</b>:
        </div>
        <pre>{JSON.stringify(lastAction, null, "  ")}</pre>
        <div>
          <b>mode</b>:
        </div>
        <pre>{JSON.stringify(state.mode, null, "  ")}</pre>
        <div>
          <b>frame:</b>
        </div>
        <pre>{JSON.stringify(state.selectedImageFrameTime, null, "  ")}</pre>
      </div>
    </SidebarBoxContainer>
  )
}

export default DebugSidebarBox
