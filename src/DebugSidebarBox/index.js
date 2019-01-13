// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"

export default ({ state, lastAction }: any) => {
  const image = (state.images || []).find(
    img => img.src === state.selectedImage
  )
  const region = image ? (image.regions || []).find(r => r.highlighted) : null

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
      </div>
    </SidebarBoxContainer>
  )
}
