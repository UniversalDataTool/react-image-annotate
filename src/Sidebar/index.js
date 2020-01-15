// @flow

import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import TaskDescription from "../TaskDescriptionSidebarBox"
import ImageSelector from "../ImageSelectorSidebarBox"
import RegionSelector from "../RegionSelectorSidebarBox"
import History from "../HistorySidebarBox"
import DebugBox from "../DebugSidebarBox"
import TagsSidebarBox from "../TagsSidebarBox"
import type { Region } from "../ImageCanvas/region-tools.js"
import ClassAdder from './ClassAdder'

const useStyles = makeStyles({})

type Image = {
  name: string,
  src: string,
  cls?: string,
  tags?: Array<string>,
  thumbnailSrc?: string,
  regions?: Array<Region>
}

type Props = {
  debug: any,
  taskDescription: string,
  images: Array<Image>,
  regions: Array<Region>,
  history: Array<{ state: Object, name: string, time: Date }>,

  labelImages?: boolean,
  currentImage?: Image,
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,

  addNewClass: any,

  onChangeImage: Image => any,
  onSelectRegion: Region => any,
  onSelectImage: Image => any,
  onChangeRegion: Region => any,
  onDeleteRegion: Region => any,
  onRestoreHistory: () => any
}

export default ({
  debug,
  taskDescription,
  images,
  regions,
  history,
  labelImages,
  currentImage,
  imageClsList,
  imageTagList,
  onClassAdd,
  onChangeImage,
  onSelectRegion,
  onSelectImage,
  onChangeRegion,
  onDeleteRegion,
  onRestoreHistory
}: Props) => {
  const classes = useStyles()

  return (
    <div>
      {debug && <DebugBox state={debug} lastAction={debug.lastAction} />}
      <TaskDescription description={taskDescription} />
      <ClassAdder onClassAdd={onClassAdd}/>
      {labelImages && (
        <TagsSidebarBox
          currentImage={currentImage}
          imageClsList={imageClsList}
          imageTagList={imageTagList}
          onChangeImage={onChangeImage}
          expandedByDefault
        />
      )}
      <ImageSelector onSelect={onSelectImage} images={images} />
      <RegionSelector
        regions={regions}
        onSelectRegion={onSelectRegion}
        onChangeRegion={onChangeRegion}
        onDeleteRegion={onDeleteRegion}
      />
      <History history={history} onRestoreHistory={() => onRestoreHistory()} />
    </div>
  )
}
