// @flow

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowsAlt,
  faMousePointer,
  faExpandArrowsAlt,
  faTag,
  faPaintBrush,
  faCrosshairs,
  faDrawPolygon,
  faVectorSquare
} from "@fortawesome/free-solid-svg-icons"
import SmallToolButton from "../SmallToolButton"
import { makeStyles } from "@material-ui/styles"
import { grey } from "@material-ui/core/colors"

const useStyles = makeStyles({
  iconTools: {
    display: "flex",
    padding: 4,
    flexDirection: "column",
    zIndex: 9,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
    borderRight: `1px solid ${grey[300]}`,
    backgroundColor: grey[100]
  }
})

export default () => {
  const classes = useStyles()
  return (
    <div className={classes.iconTools}>
      <SmallToolButton
        name="Select Region"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faMousePointer} />}
      />
      <SmallToolButton
        name="Move Region"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faArrowsAlt} />}
      />
      <SmallToolButton
        name="Resize Region"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faExpandArrowsAlt} />}
      />
      <SmallToolButton
        name="Change Tag(s)"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faTag} />}
      />
      <SmallToolButton
        name="Add Point"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faCrosshairs} />}
      />
      <SmallToolButton
        name="Add Bounding Box"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faVectorSquare} />}
      />
      <SmallToolButton
        name="Add Polygon"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faDrawPolygon} />}
      />
      <SmallToolButton
        name="Add Pixel Region"
        icon={<FontAwesomeIcon size="xs" fixedWidth icon={faPaintBrush} />}
      />
    </div>
  )
}
