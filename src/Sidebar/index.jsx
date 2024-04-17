// @flow

import React from "react"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import RegionSelector from "../RegionSelectorSidebarBox"
import History from "../HistorySidebarBox"
import DebugBox from "../DebugSidebarBox"
import TagsSidebarBox from "../TagsSidebarBox"
import KeyframesSelector from "../KeyframesSelectorSidebarBox"

const theme = createTheme()
const Container = styled("div")(({theme}) => ({}))

const emptyArr = []

export const Sidebar = ({
  debug,
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
}) => {
  if (!regions) regions = emptyArr

  return (
    <ThemeProvider theme={theme}>
      <Container>
        {debug && <DebugBox state={debug} lastAction={debug.lastAction} />}
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
