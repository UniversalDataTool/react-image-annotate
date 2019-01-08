// @flow

import React from "react"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"

export default ({ name, icon }: { name: string, icon: any }) => {
  return (
    <Tooltip placement="right" title={name}>
      <IconButton
        aria-label={name}
        size="small"
        style={{ width: 50, height: 50, margin: 1 }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  )
}

