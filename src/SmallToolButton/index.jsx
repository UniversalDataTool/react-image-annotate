// @flow

import React, { createContext, memo, useContext } from "react"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import { blue } from "@mui/material/colors"
import PropTypes from "prop-types"

export const SelectedTool = createContext()

export const SmallToolButton = ({
  id,
  name,
  icon,
  selected,
  togglable,
  alwaysShowing = false,
}) => {
  const { enabledTools, selectedTool, onClickTool } = useContext(SelectedTool)
  if (!enabledTools.includes(id) && !alwaysShowing) return null
  selected = selected || selectedTool === id
  return (
    <Tooltip placement="right" title={name}>
      <div>
        <IconButton
          disabled={!togglable ? selected : undefined}
          aria-label={name}
          onClick={() => onClickTool(id)}
          size="small"
          style={{
            width: 50,
            height: 50,
            margin: 1,
            color: selected ? blue[500] : undefined,
          }}
        >
          {icon}
        </IconButton>
      </div>
    </Tooltip>
  )
}

export default memo(
  SmallToolButton,
  (prevProps, nextProps) =>
    prevProps.togglable === nextProps.togglable &&
    prevProps.selected === nextProps.selected &&
    prevProps.name === nextProps.name &&
    prevProps.id === nextProps.id
)

SmallToolButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  alwaysShowing: PropTypes.bool,
  selected: PropTypes.bool,
  togglable: PropTypes.bool,
}