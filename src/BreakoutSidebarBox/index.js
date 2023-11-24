// @flow
import {
  FormControlLabel,
  IconButton,
  Radio,
  Switch,
  withStyles,
} from "@material-ui/core"
import Grid from "@material-ui/core/Grid"
import { green, grey } from "@material-ui/core/colors"
import { makeStyles, styled } from "@material-ui/core/styles"
import DashboardIcon from "@material-ui/icons/Dashboard"
import TrashIcon from "@material-ui/icons/Delete"
import isEqual from "lodash/isEqual"
import React, { memo, useMemo, useState } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import styles from "./styles"
const useStyles = makeStyles(styles)

const HeaderSep = styled("div")({
  borderTop: `1px solid ${grey[200]}`,
  marginTop: 2,
  marginBottom: 2,
})

const GreenRadio = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />)

const RedSwitch = withStyles({
  switchBase: {
    color: "white",

    "&$checked": {
      color: "#F50057",
    },
    "&$checked + $track": {
      backgroundColor: "#F50057",
    },
  },
  checked: {},
  track: {
    backgroundColor: "white",
  },
})(Switch)

const RowLayout = ({
  order,
  classification,
  trash,
  visible,
  onClick,
  defaultToggle,
}) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      // className={classnames(classes.row, { header, highlighted })}
    >
      <Grid
        container
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Grid item xs={1}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid> */}
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          {visible}
        </Grid>

        <Grid item xs={2}>
          {defaultToggle}
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
    <Grid
      container
      style={{
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        item
        xs={4}
        style={{
          paddingLeft: 16,
        }}
      >
        Breakout Name
      </Grid>
      <Grid item xs={1}>
        {/* | */}
      </Grid>
      <Grid item xs={2}>
        {/* <VisibilityIcon className="icon" /> */}
        Visibility
      </Grid>
      <Grid item xs={1}>
        {/* | */}
      </Grid>
      <Grid item xs={2}>
        Auto-Add
      </Grid>

      <Grid
        item
        xs={2}
        style={{
          paddingLeft: 8,
        }}
      >
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
  isAutoAdd,
  onBreakoutDelete,
  onBreakoutVisible,
  onBreakoutAutoAdd,
}) => {
  return (
    <RowLayout
      header={false}
      order={`#${index + 1}`}
      classification={name}
      area=""
      visible={
        <>
          <FormControlLabel
            control={
              <RedSwitch
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
        <IconButton
          aria-label="delete"
          size="small"
          className="icon2"
          onClick={() => onBreakoutDelete(id)}
        >
          <TrashIcon style={{ color: "white" }} />
        </IconButton>
      }
      defaultToggle={
        <div>
          <GreenRadio
            checked={isAutoAdd}
            onClick={() => onBreakoutAutoAdd(id)}
            value={id}
            name="radio-button-demo"
            size="small"
          />
        </div>
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
    prevProps.isAutoAdd === nextProps.isAutoAdd &&
    prevProps.is_breakout === nextProps.is_breakout &&
    prevProps.onBreakoutDelete === nextProps.onBreakoutDelete &&
    prevProps.onBreakoutVisible === nextProps.onBreakoutVisible &&
    prevProps.onBreakoutAutoAdd === nextProps.onBreakoutAutoAdd
)

const emptyArr = []

export const BreakoutSidebarBox = ({
  regions,
  breakouts,
  onBreakoutDelete,
  onBreakoutVisible,
  onBreakoutAutoAdd,
  selectedBreakoutIdAutoAdd,
  selectedBreakoutToggle,
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
                isAutoAdd={r.id === selectedBreakoutIdAutoAdd}
                onBreakoutDelete={onBreakoutDelete}
                onBreakoutVisible={onBreakoutVisible}
                onBreakoutAutoAdd={onBreakoutAutoAdd}
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

export default memo(BreakoutSidebarBox, (prevProps, nextProps) => {
  const prevSelectedBreakoutIdAutoAdd = prevProps.selectedBreakoutIdAutoAdd
  const nextSelectedBreakoutIdAutoAdd = nextProps.selectedBreakoutIdAutoAdd

  return (
    isEqual(
      (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
      (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
    ) &&
    isEqual(prevProps.breakouts, nextProps.breakouts) &&
    prevSelectedBreakoutIdAutoAdd == nextSelectedBreakoutIdAutoAdd
  )
})
