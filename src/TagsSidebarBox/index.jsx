import React, { memo, useMemo } from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import StyleIcon from "@mui/icons-material/Style"
import { grey } from "@mui/material/colors"
import Select from "react-select"
import useEventCallback from "use-event-callback"
import { asMutable } from "seamless-immutable"
import PropTypes from "prop-types"

const emptyArr = []
const noop = () => null

export const TagsSidebarBox = ({
  currentImage,
  imageClsList = emptyArr,
  imageTagList = emptyArr,
  onChangeImage = noop,
}) => {
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

TagsSidebarBox.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentImage: PropTypes.shape({ 
    cls: PropTypes.string, 
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  imageClsList: PropTypes.arrayOf(PropTypes.string),
  imageTagList: PropTypes.arrayOf(PropTypes.string),
  onChangeImage: PropTypes.func.isRequired,
}