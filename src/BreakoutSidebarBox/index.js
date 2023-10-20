// @flow
import Grid from "@material-ui/core/Grid"
import { grey } from "@material-ui/core/colors"
import { makeStyles, styled } from "@material-ui/core/styles"
import DashboardIcon from "@material-ui/icons/Dashboard"
import TrashIcon from "@material-ui/icons/Delete"
import isEqual from "lodash/isEqual"
import React, { memo, useMemo, useState } from "react"
import DeviceList from "../RegionLabel/DeviceList"
import SidebarBoxContainer from "../SidebarBoxContainer"
import styles from "./styles"
import VisibilityIcon from "@material-ui/icons/Visibility"
import { FormControlLabel, Switch } from "@material-ui/core"
const useStyles = makeStyles(styles)

const HeaderSep = styled("div")({
  borderTop: `1px solid ${grey[200]}`,
  marginTop: 2,
  marginBottom: 2,
})

const DEVICE_LIST = [...new Set(DeviceList.map((item) => item.category))]

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}

const RowLayout = ({ order, classification, trash, visible, onClick }) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      // className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={8}>
          {classification}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
      </Grid>
    </div>
  )
}

const RowHeader = ({}) => {
  return (
    <Grid container>
      <Grid
        item
        xs={10}
        style={{
          paddingLeft: 16,
        }}
      >
        Breakout Name
      </Grid>
      <Grid item xs={1}>
        <VisibilityIcon className="icon" />
      </Grid>
      <Grid item xs={1}>
        <TrashIcon className="icon" />
      </Grid>
    </Grid>
  )
}

const MemoRowHeader = memo(RowHeader)

const Row = ({
  id,
  name,
  is_breakout,
  visible,
  index,
  onBreakoutDelete,
  onBreakoutVisible,
}) => {
  return (
    <RowLayout
      header={false}
      //   onClick={() => onSelectBreakout(r)}
      order={`#${index + 1}`}
      classification={name}
      area=""
      visible={
        <>
          <FormControlLabel
            control={
              <Switch
                style={{
                  color: "white",
                }}
                size="small"
                id={name}
                checked={visible}
                onChange={() => {
                  onBreakoutVisible(id)
                }}
              />
            }
          />
        </>
      }
      trash={
        <TrashIcon onClick={() => onBreakoutDelete(id)} className="icon2" />
      }
    />
  )
}

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.visible === nextProps.visible &&
    prevProps.id === nextProps.id &&
    prevProps.name === nextProps.name &&
    prevProps.is_breakout === nextProps.is_breakout &&
    prevProps.onBreakoutDelete === nextProps.onBreakoutDelete
)

const emptyArr = []

export const BreakoutSidebarBox = ({
  regions,
  breakouts,
  onBreakoutDelete,
  onBreakoutVisible,
}) => {
  const breakoutList = useMemo(() => {
    const breakoutRegions = [
      ...new Set(
        breakouts
          .filter((obj) => obj.is_breakout === true)
          .map((obj) => JSON.stringify(obj))
      ),
    ].map((str) => JSON.parse(str))
    if (breakoutRegions.length === 0) return null
    return breakoutRegions
  }, [breakouts])

  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Breakouts"
      subTitle=""
      icon={<DashboardIcon style={{ color: "white" }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        <MemoRowHeader />
        <HeaderSep />

        {breakoutList &&
          breakoutList.map((r, i) => (
            <>
              <MemoRow
                index={i}
                key={r.id}
                id={r.id}
                name={r.name}
                is_breakout={r.is_breakout}
                visible={r.visible}
                onBreakoutDelete={onBreakoutDelete}
                onBreakoutVisible={onBreakoutVisible}
              />
            </>
          ))}
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
  r.breakout,
]

export default memo(BreakoutSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
)
