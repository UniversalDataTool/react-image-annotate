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
  faVectorSquare,
  faHandPaper,
  faSearch
} from "@fortawesome/free-solid-svg-icons"
import { faCircle } from "@fortawesome/free-regular-svg-icons"
import SmallToolButton, { SelectedTool } from "../SmallToolButton"
import { makeStyles } from "@material-ui/core/styles"
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

type Props = {
  showTags?: boolean,
  enabledTools?: Array<string>,
  selectedTool: string,
  onClickTool: string => any
}

export default ({
  showTags,
  selectedTool,
  onClickTool,
  enabledTools = ["select", "create-point", "create-box", "create-polygon", "create-circle"]
}: Props) => {
  const classes = useStyles()
  return (
    <div className={classes.iconTools}>
      <SelectedTool.Provider
        value={{ enabledTools, selectedTool, onClickTool }}
      >
        <SmallToolButton
          id="select"
          name="Select Region"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faMousePointer} />}
        />
        <SmallToolButton
          alwaysShowing
          id="pan"
          name="Drag/Pan"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faHandPaper} />}
        />
        <SmallToolButton
          alwaysShowing
          id="zoom"
          name="Zoom In/Out"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faSearch} />}
        />
        {/* <SmallToolButton
          name="Move Region"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faArrowsAlt} />}
        />
        <SmallToolButton
          name="Resize Region"
          icon={
            <FontAwesomeIcon size="xs" fixedWidth icon={faExpandArrowsAlt} />
          }
        /> */}
        <SmallToolButton
          alwaysShowing
          togglable
          id="show-tags"
          selected={showTags}
          name="Show Tags"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faTag} />}
        />
        <SmallToolButton
          id="create-point"
          name="Add Point"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faCrosshairs} />}
        />
        <SmallToolButton
          id="create-box"
          name="Add Bounding Box"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faVectorSquare} />}
        />
        <SmallToolButton
          id="create-polygon"
          name="Add Polygon"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faDrawPolygon} />}
        />
        <SmallToolButton
          id="create-circle"
          name="Add Circle"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faCircle} />}
        />
        {/* <SmallToolButton
          id="create-pixel"
          name="Add Pixel Region"
          icon={<FontAwesomeIcon size="xs" fixedWidth icon={faPaintBrush} />}
        /> */}
      </SelectedTool.Provider>
    </div>
  )
}
