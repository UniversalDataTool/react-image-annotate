// @flow

import React, { useMemo, memo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import StyleIcon from "@mui/icons-material/Style"
import { grey } from "@mui/material/colors"
import Select from "react-select"
import useEventCallback from "use-event-callback"
import { asMutable } from "seamless-immutable"

type Props = {
  tags: Array<string>,
  currentImage: { cls?: string, tags?: Array<string> },
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,
  onChangeImage: (Array<string>) => any,
}

const emptyArr = []
const noop = () => null

export const TagsSidebarBox = ({
  currentImage,
  imageClsList = emptyArr,
  imageTagList = emptyArr,
  onChangeImage = noop,
}: Props) => {
  const { tags = [], cls = null } = currentImage || {}
  const onChangeClassification = useEventCallback((o) =>
    onChangeImage({ cls: o.value })
  )
  const onChangeTags = useEventCallback((o) =>
    onChangeImage({ tags: o.map((a) => a.value) })
  )
  const selectValue = useMemo(
    () => (cls ? { value: cls, label: cls } : null),
    [cls]
  )
  const memoImgClsList = useMemo(
    () => asMutable(imageClsList.map((c) => ({ value: c, label: c }))),
    [imageClsList]
  )
  const memoImgTagList = useMemo(
    () => asMutable(imageTagList.map((c) => ({ value: c, label: c }))),
    [imageTagList]
  )
  const memoCurrentTags = useMemo(
    () => tags.map((r) => ({ value: r, label: r })),
    [tags]
  )

  if (!currentImage) return null

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
            onChange={onChangeClassification}
            value={selectValue}
            options={memoImgClsList}
          />
        </div>
      )}
      {imageTagList.length > 0 && (
        <div style={{ padding: 8, paddingTop: 0 }}>
          <Select
            isMulti
            placeholder="Image Tags"
            onChange={onChangeTags}
            value={memoCurrentTags}
            options={memoImgTagList}
          />
        </div>
      )}
    </SidebarBoxContainer>
  )
}

export default memo(
  TagsSidebarBox,
  (prevProps, nextProps) =>
    prevProps.currentImage.cls === nextProps.currentImage.cls &&
    prevProps.currentImage.tags === nextProps.currentImage.tags &&
    prevProps.imageClsList === nextProps.imageClsList &&
    prevProps.imageTagList === nextProps.imageTagList
)
