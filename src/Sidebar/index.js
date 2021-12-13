// @flow

import React from "react"
import { styled } from "@mui/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import TaskDescription from "../TaskDescriptionSidebarBox"
import ImageSelector from "../ImageSelectorSidebarBox"
import RegionSelector from "../RegionSelectorSidebarBox"
import History from "../HistorySidebarBox"
import DebugBox from "../DebugSidebarBox"
import TagsSidebarBox from "../TagsSidebarBox"
import KeyframesSelector from "../KeyframesSelectorSidebarBox"
import type { Region } from "../ImageCanvas/region-tools.js"

const theme = createTheme()
const Container = styled("div")(({ theme }) => ({}))

type Image = {
  name: string,
  src: string,
  cls?: string,
  tags?: Array<string>,
  thumbnailSrc?: string,
  regions?: Array<Region>,
}

type Props = {
  debug: any,
  taskDescription: string,
  images?: Array<Image>,
  regions: Array<Region>,
  history: Array<{ state: Object, name: string, time: Date }>,

  labelImages?: boolean,
  currentImage?: Image,
  imageClsList?: Array<string>,
  imageTagList?: Array<string>,

  onChangeImage: (Image) => any,
  onSelectRegion: (Region) => any,
  onSelectImage: (Image) => any,
  onChangeRegion: (Region) => any,
  onDeleteRegion: (Region) => any,
  onRestoreHistory: () => any,
  onShortcutActionDispatched: (action: any) => any,
}

const emptyArr = []

export const Sidebar = ({
  debug,
  taskDescription,
  keyframes,
  images,
  regions,
  history,
  labelImages,
  currentImage,
  currentVideoTime,
  imageClsList,
  imageTagList,
  onChangeImage,
  onSelectRegion,
  onSelectImage,
  onChangeRegion,
  onDeleteRegion,
  onRestoreHistory,
  onChangeVideoTime,
  onDeleteKeyframe,
  onShortcutActionDispatched,
}: Props) => {
  if (!regions) regions = emptyArr

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {debug && <DebugBox state={debug} lastAction={debug.lastAction} />}
        {taskDescription && (taskDescription || "").length > 1 && (
          <TaskDescription description={taskDescription} />
        )}
        {labelImages && (
          <TagsSidebarBox
            currentImage={currentImage}
            imageClsList={imageClsList}
            imageTagList={imageTagList}
            onChangeImage={onChangeImage}
            expandedByDefault
          />
        )}
        {/* {images && images.length > 1 && (
        <ImageSelector onSelect={onSelectImage} images={images} />
      )} */}
        <RegionSelector
          regions={regions}
          onSelectRegion={onSelectRegion}
          onChangeRegion={onChangeRegion}
          onDeleteRegion={onDeleteRegion}
        />
        {keyframes && (
          <KeyframesSelector
            currentVideoTime={currentVideoTime}
            keyframes={keyframes}
            onChangeVideoTime={onChangeVideoTime}
            onDeleteKeyframe={onDeleteKeyframe}
          />
        )}
        <History
          history={history}
          onRestoreHistory={() => onRestoreHistory()}
        />
        {/* <Shortcuts onShortcutActionDispatched={onShortcutActionDispatched} /> */}
      </Container>
    </ThemeProvider>
  )
}

export default Sidebar
