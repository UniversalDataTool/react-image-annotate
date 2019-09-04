// @flow

import React from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import { makeStyles } from "@material-ui/core/styles"
import StyleIcon from "@material-ui/icons/Style"
import { grey } from "@material-ui/core/colors"
import Select from "react-select"

const useStyles = makeStyles({})

type Props = {
  tags: Array<string>,
  currentImage: { cls?: string, tags?: Array<string> },
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,
  onChangeImage: (Array<string>) => any
}

export default ({
  currentImage,
  imageClsList = [],
  imageTagList = [],
  onChangeImage
}: Props) => {
  const { tags = [], cls = null } = currentImage
  return (
    <SidebarBoxContainer
      title="Image Tags"
      expandedByDefault
      noScroll
      icon={<StyleIcon style={{ color: grey[700] }} />}
    >
      {imageClsList.length > 0 && (
        <div style={{ padding: 8 }}>
          <Select
            placeholder="Image Classification"
            onChange={o => onChangeImage({ cls: o.value })}
            value={cls ? { value: cls, label: cls } : cls}
            options={imageClsList.map(c => ({ value: c, label: c }))}
          />
        </div>
      )}
      {imageTagList.length > 0 && (
        <div style={{ padding: 8, paddingTop: 0 }}>
          <Select
            isMulti
            placeholder="Image Tags"
            onChange={o => onChangeImage({ tags: o.map(a => a.value) })}
            value={tags.map(r => ({ value: r, label: r }))}
            options={imageTagList.map(c => ({ value: c, label: c }))}
          />
        </div>
      )}
    </SidebarBoxContainer>
  )
}
