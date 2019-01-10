// @flow

import React, { createContext, useContext } from "react"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import { blue } from "@material-ui/core/colors"

export const SelectedTool = createContext()

export default ({ name, icon }: { name: string, icon: any }) => {
  const selected = useContext(SelectedTool) === name
  return (
    <Tooltip placement="right" title={name}>
      <IconButton
        disabled={selected}
        aria-label={name}
        size="small"
        style={{
          width: 50,
          height: 50,
          margin: 1,
          color: selected ? blue[500] : undefined
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}
