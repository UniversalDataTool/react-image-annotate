// @flow
import {
  FormControlLabel,
  FormGroup,
  MuiThemeProvider,
  Switch,
  ThemeProvider,
  createTheme,
  withStyles,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import PieChartIcon from "@material-ui/icons/PieChart"
import ReorderIcon from "@material-ui/icons/SwapVert"
import ToggleOnIcon from "@material-ui/icons/ToggleOn"
import isEqual from "lodash/isEqual"
import React, { memo, useCallback, useState } from "react"
import DeviceList from "../RegionLabel/DeviceList"
import SidebarBoxContainer from "../SidebarBoxContainer"
import styles from "./styles"
import { ColorMapping } from "../RegionLabel/ColorMapping"

const useStyles = makeStyles(styles)

const DEVICE_LIST = [...new Set(DeviceList.map((item) => item.category))]

const theme = createTheme({
  overrides: {
    MuiSwitch: {
      switchBase: {
        // Controls default (unchecked) color for the thumb
        color: "#ccc",
      },
      colorSecondary: {
        "&$checked": {
          // Controls checked color for the thumb
          color: "#f2ff00",
        },
      },
      track: {
        // Controls default (unchecked) color for the track
        opacity: 0.2,
        backgroundColor: "#fff",
        "$checked$checked + &": {
          // Controls checked color for the track
          opacity: 0.7,
          backgroundColor: "#fff",
        },
      },
    },
  },
})

Object.keys(ColorMapping).forEach(
  (device) =>
    (theme.overrides.MuiSwitch = {
      ...theme.overrides.MuiSwitch,
      [device]: {
        switchBase: {
          // Controls default (unchecked) color for the thumb
          color: "#ccc",
        },
        colorSecondary: {
          "&$checked": {
            // Controls checked color for the thumb
            color: ColorMapping[device],
          },
        },
      },
    })
)

console.log(theme)

const RowLayout = ({ visible, onClick }) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
    >
      <Grid
        container
        style={{
          paddingLeft: 10,
        }}
        alignItems="center"
      >
        {visible}
      </Grid>
    </div>
  )
}

const RowHeader = ({ onRegionToggle }) => {
  const [checkedList, setCheckedList] = useState(
    DEVICE_LIST.map((item) => ({
      item: item,
      checked: true,
    }))
  )

  const setCheckedItem = useCallback((id, checked) => {
    setCheckedList(() =>
      checkedList.map((item) =>
        item.item === id ? { ...item, checked: checked } : item
      )
    )
  })

  const handleChange = (event) => {
    onRegionToggle(event)
    setCheckedItem(event.target.id, event.target.checked)
  }

  return (
    <RowLayout
      style={{ paddingLeft: 10 }}
      header
      highlighted={false}
      order={<ReorderIcon className="icon" />}
      classification={<div style={{ paddingLeft: 10 }}>Class</div>}
      area={<PieChartIcon className="icon" />}
      trash={<TrashIcon className="icon" />}
      lock={<LockIcon className="icon" />}
      visible={
        <div>
          <FormGroup>
            {DEVICE_LIST.map((device, index) => {
              return (
                <div key={index}>
                  <FormControlLabel
                    control={
                      <Switch
                        style={{
                          color: "white",
                          "&MuiSwitch-colorSecondary": {
                            color: ColorMapping[device],
                          },
                        }}
                        size="small"
                        id={device}
                        checked={
                          (
                            checkedList.find((item) => item.item === device) ||
                            {}
                          ).checked
                        }
                        onChange={handleChange}
                      />
                    }
                    label={device}
                  />
                </div>
              )
            })}
          </FormGroup>
        </div>
      }
    />
  )
}

// const MemoRowHeader = memo(RowHeader)

const emptyArr = []

const MemoRowHeader = memo(
  RowHeader,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color
)

export const ToggleSidebarBox = ({ regions = emptyArr, onRegionToggle }) => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Toggles"
      icon={<ToggleOnIcon style={{ color: "white" }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        <MemoRowHeader onRegionToggle={onRegionToggle} />
      </div>
    </SidebarBoxContainer>
  )
}

const mapUsedRegionProperties = (r) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
]

export default memo(ToggleSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
)
