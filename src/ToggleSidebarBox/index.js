// @flow
import {
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  Switch,
  Tooltip,
  createTheme,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import PieChartIcon from "@material-ui/icons/PieChart"
import DashboardIcon from "@material-ui/icons/Dashboard"
import ReorderIcon from "@material-ui/icons/SwapVert"
import ToggleOnIcon from "@material-ui/icons/ToggleOn"
import isEqual from "lodash/isEqual"
import React, { memo, useCallback, useMemo, useState } from "react"
import { ColorMapping } from "../RegionLabel/ColorMapping"
import DeviceList from "../RegionLabel/DeviceList"
import SidebarBoxContainer from "../SidebarBoxContainer"
import styles from "./styles"

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

const RowHeader = ({
  onRegionToggle,
  regions,
  onRegionBreakout,
  categoryFilters,
}) => {
  const [checkedList, setCheckedList] = useState(
    DEVICE_LIST.map((item) => {
      if (regions !== undefined && regions.length > 0) {
        let matchedObject = regions.find((region) => {
          return region.category === item
        })
        return {
          item: item,
          checked: matchedObject ? matchedObject.visible : true,
        }
      } else {
        return {
          item: item,
          checked: true,
        }
      }
    })
  )

  useMemo(() => {
    setCheckedList(
      DEVICE_LIST.map((item) => {
        if (regions !== undefined && regions.length > 0) {
          let matchedObject = regions.find((region) => {
            return region.category === item
          })
          return {
            item: item,
            checked: matchedObject ? matchedObject.visible : true,
          }
        } else {
          return {
            item: item,
            checked: true,
          }
        }
      })
    )
  }, [regions])

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

  const handleBreakout = (regionCategory) => {
    onRegionBreakout(regionCategory)
  }

  function rand() {
    return Math.round(Math.random() * 20) - 10
  }

  function getModalStyle() {
    const top = 50 + rand()
    const left = 50 + rand()

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    }
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }))

  const classes = useStyles()
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <h2 id="simple-modal-title">Text in a modal</h2>
      <p id="simple-modal-description">
        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      </p>
      <RowHeader />
    </div>
  )
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
                    label={
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ paddingRight: 10, fontSize: "0.7500em" }}>
                          {device}
                        </div>
                        <div
                          style={{
                            backgroundColor: ColorMapping[device],
                            color: "white",
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                          }}
                        />
                      </div>
                    }
                  />
                  {/* <Tooltip
                    title="Add Breakout"
                    placement="bottom"
                    arrow
                    enterTouchDelay={0}
                    style={{
                      fontSize: "0.7500em",
                      color: "white",
                    }}
                  > */}
                  <IconButton
                    style={{
                      color: "white",
                    }}
                    disabled={
                      regions.filter((region) => region.category === device)
                        .length === 0
                    }
                    onClick={() => handleBreakout(device)}
                  >
                    <DashboardIcon
                      style={{
                        color:
                          regions.filter((region) => region.category === device)
                            .length === 0
                            ? "grey"
                            : "white",
                        width: 20,
                        height: 20,
                        ":hover": {
                          // if not disabled add a shadow
                          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                        },
                      }}
                    />
                  </IconButton>
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

// const MemoRowHeader = memo(
//   RowHeader,
//   (prevProps, nextProps) =>
//     prevProps.highlighted === nextProps.highlighted &&
//     prevProps.visible === nextProps.visible &&
//     prevProps.locked === nextProps.locked &&
//     prevProps.id === nextProps.id &&
//     prevProps.index === nextProps.index &&
//     prevProps.cls === nextProps.cls &&
//     prevProps.color === nextProps.color &&
//     prevProps.region === nextProps.region
// )

export const ToggleSidebarBox = ({
  categoryFilters,
  regions,
  onRegionToggle,
  onRegionBreakout,
}) => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Toggles"
      icon={<ToggleOnIcon style={{ color: "white" }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        <RowHeader
          onRegionToggle={onRegionToggle}
          regions={regions}
          onRegionBreakout={onRegionBreakout}
          categoryFilters={categoryFilters}
        />
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
