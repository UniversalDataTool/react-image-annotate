// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import DescriptionIcon from "@material-ui/icons/Description"
import { makeStyles } from "@material-ui/styles"
import { grey } from "@material-ui/core/colors"
import Markdown from "react-markdown"

const useStyles = makeStyles({})

export default ({ description }) => {
  const classes = useStyles()

  return (
    <SidebarBoxContainer
      title="Task Description"
      icon={<DescriptionIcon style={{ color: grey[700] }} />}
    >
      <Markdown source={description} />
    </SidebarBoxContainer>
  )
}
