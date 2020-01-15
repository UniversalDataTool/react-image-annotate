// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import DescriptionIcon from "@material-ui/icons/Description"
import { makeStyles } from "@material-ui/core/styles"
import { grey } from "@material-ui/core/colors"
import Markdown from "react-markdown"

const useStyles = makeStyles({
  markdownContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 12,
    "& h1": { fontSize: 18 },
    "& h2": { fontSize: 14 },
    "& h3": { fontSize: 12 },
    "& h4": { fontSize: 12 },
    "& h5": { fontSize: 12 },
    "& h6": { fontSize: 12 },
    "& p": { fontSize: 12 },
    "& a": {},
    "& img": { width: "100%" }
  }
})

export default ({ onClassAdd }) => {
  const classes = useStyles()

  return (
    <SidebarBoxContainer
      title="Add new class"
      icon={<DescriptionIcon style={{ color: grey[700] }} />}
      expandedByDefault
    >
      <input type="text" placeholder="new class name"/>
      <button onClick={() => onClassAdd('testink')}>
          Add new
      </button>
    </SidebarBoxContainer>
  )
}
