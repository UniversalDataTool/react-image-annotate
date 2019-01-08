// @flow

import React, { Fragment, useState } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles } from "@material-ui/styles"
import RegionIcon from "@material-ui/icons/PictureInPicture"
import { grey, blue, orange, purple } from "@material-ui/core/colors"
import Grid from "@material-ui/core/Grid"
import ReorderIcon from "@material-ui/icons/SwapVert"
import PieChartIcon from "@material-ui/icons/PieChart"
import TrashIcon from "@material-ui/icons/Delete"
import LockIcon from "@material-ui/icons/Lock"
import VisibleIcon from "@material-ui/icons/Visibility"
import VisibleOffIcon from "@material-ui/icons/VisibilityOff"

const useStyles = makeStyles({
  container: {
    fontSize: 11,
    fontWeight: "bold",
    color: grey[700],
    "& .icon": {
      marginTop: 4,
      width: 16,
      height: 16
    },
    "& .icon2": {
      opacity: 0.5,
      width: 16,
      height: 16,
      transition: "200ms opacity",
      "&:hover": {
        cursor: "pointer",
        opacity: 1
      }
    }
  },
  row: {
    padding: 4,
    "&.header:hover": {
      backgroundColor: "#fff"
    },
    "&:hover": {
      backgroundColor: blue[50],
      color: grey[800]
    }
  },
  chip: {
    display: "flex",
    flexDirection: "row",
    padding: 2,
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: "center",
    "& .color": {
      borderRadius: 5,
      width: 10,
      height: 10,
      marginRight: 4
    },
    "& .text": {}
  }
})

const Chip = ({ color, text }) => {
  const classes = useStyles()
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  )
}

const Row = ({
  header,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible
}) => {
  const classes = useStyles()
  const [mouseOver, changeMouseOver] = useState(false)
  return (
    <div
      onMouseEnter={() => changeMouseOver(true)}
      onMouseLeave={() => changeMouseOver(false)}
      className={`${classes.row} ${header ? "header" : ""}`}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 6 }}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid>
    </div>
  )
}

export default () => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Regions"
      subTitle=""
      icon={<RegionIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <div className={classes.container}>
        <Row
          header
          order={<ReorderIcon className="icon" />}
          classification={<div style={{ paddingLeft: 10 }}>Class</div>}
          area={<PieChartIcon className="icon" />}
          trash={<TrashIcon className="icon" />}
          lock={<LockIcon className="icon" />}
          visible={<VisibleIcon className="icon" />}
        />
        <div
          style={{
            borderTop: `1px solid ${grey[200]}`,
            marginTop: 2,
            marginBottom: 2
          }}
        />
        <Row
          order={"#1"}
          classification={<Chip text="Car" color={orange[800]} />}
          area="11%"
          trash={<TrashIcon className="icon2" />}
          lock={<LockIcon className="icon2" />}
          visible={<VisibleIcon className="icon2" />}
        />
        <Row
          order={"#2"}
          classification={<Chip text="Truck" color={purple[800]} />}
          area="30%"
          trash={<TrashIcon className="icon2" />}
          lock={<LockIcon className="icon2" />}
          visible={<VisibleIcon className="icon2" />}
        />
        <Row
          order={"#3"}
          classification="Bicyclist"
          area="4%"
          trash={<TrashIcon className="icon2" />}
          lock={<LockIcon className="icon2" />}
          visible={<VisibleIcon className="icon2" />}
        />
      </div>
    </SidebarBoxContainer>
  )
}
