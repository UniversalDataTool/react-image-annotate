// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles } from "@material-ui/styles"

const useStyles = makeStyles({})

export default () => {
  const classes = useStyles()
  return (
    <SidebarBoxContainer
      title="Regions"
      subTitle=""
      icon={<CollectionsIcon />}
    />
  )
}
