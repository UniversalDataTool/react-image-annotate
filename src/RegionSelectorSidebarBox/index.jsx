// @flow

import React, {memo} from "react"
import SidebarBoxContainer from "../SidebarBoxContainer"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import {grey} from "@mui/material/colors"
import RegionIcon from "@mui/icons-material/PictureInPicture"
import Grid from "@mui/material/Grid"
import ReorderIcon from "@mui/icons-material/SwapVert"
import PieChartIcon from "@mui/icons-material/PieChart"
import TrashIcon from "@mui/icons-material/Delete"
import LockIcon from "@mui/icons-material/Lock"
import UnlockIcon from "@mui/icons-material/LockOpen"
import VisibleIcon from "@mui/icons-material/Visibility"
import VisibleOffIcon from "@mui/icons-material/VisibilityOff"
import styles from "./styles"
import classnames from "classnames"
import isEqual from "lodash/isEqual"
import {useTranslation} from "react-i18next";

const theme = createTheme()

const ChipSpan = styled('span')(() => styles.chip)
const RowDiv = styled('div')(() => styles.row)
const ContainerDiv = styled('div')(() => styles.container)
const HeaderSep = styled("div")(({theme}) => ({
  borderTop: `1px solid ${grey[200]}`,
  marginTop: 2,
  marginBottom: 2,
}))

const Chip = ({color, text}) => {
  return (
    <ChipSpan>
      <div className="color" style={{backgroundColor: color}} />
      <div className="text">{text}</div>
    </ChipSpan>
  )
}

const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  area,
  tags,
  trash,
  lock,
  visible,
  onClick,
}) => {
  return (
    <RowDiv
      onClick={onClick}
      className={classnames({header, highlighted})}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <div style={{textAlign: "right", paddingRight: 10}}>{order}</div>
        </Grid>
        <Grid item xs={5}>
          {classification}
        </Grid>
        <Grid item xs={2}>
          <div style={{textAlign: "right", paddingRight: 6}}>{area}</div>
        </Grid>
        <Grid item xs={1}>
          {trash}
        </Grid>
        <Grid item xs={1}>
          {lock}
        </Grid>
        <Grid item xs={1}>
          {visible}
        </Grid>
      </Grid>
    </RowDiv>
  )
}

const RowHeader = () => {
  return (
    <RowLayout
      header
      highlighted={false}
      order={<ReorderIcon className="icon" />}
      classification={<div style={{paddingLeft: 10}}>Class</div>}
      area={<PieChartIcon className="icon" />}
      trash={<TrashIcon className="icon" />}
      lock={<LockIcon className="icon" />}
      visible={<VisibleIcon className="icon" />}
    />
  )
}

const MemoRowHeader = memo(RowHeader)

const Row = ({
  region: r,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  visible,
  locked,
  color,
  cls,
  index,
}) => {
  return (
    <RowLayout
      header={false}
      highlighted={highlighted}
      onClick={() => onSelectRegion(r)}
      order={`#${index + 1}`}
      classification={<Chip text={cls || ""} color={color || "#ddd"} />}
      area=""
      trash={<TrashIcon onClick={() => onDeleteRegion(r)} className="icon2" />}
      lock={
        r.locked ? (
          <LockIcon
            onClick={() => onChangeRegion({...r, locked: false})}
            className="icon2"
          />
        ) : (
          <UnlockIcon
            onClick={() => onChangeRegion({...r, locked: true})}
            className="icon2"
          />
        )
      }
      visible={
        r.visible || r.visible === undefined ? (
          <VisibleIcon
            onClick={() => onChangeRegion({...r, visible: false})}
            className="icon2"
          />
        ) : (
          <VisibleOffIcon
            onClick={() => onChangeRegion({...r, visible: true})}
            className="icon2"
          />
        )
      }
    />
  )
}

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.id === nextProps.id &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color
)

const emptyArr = []

export const RegionSelectorSidebarBox = ({
  regions = emptyArr,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
}) => {

  const {t} = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title={t("menu.regions")}
        subTitle=""
        icon={<RegionIcon style={{color: grey[700]}} />}
        expandedByDefault
      >
        <ContainerDiv>
          <MemoRowHeader />
          <HeaderSep />
          {regions.map((r, i) => (
            <MemoRow
              key={r.id}
              {...r}
              region={r}
              index={i}
              onSelectRegion={onSelectRegion}
              onDeleteRegion={onDeleteRegion}
              onChangeRegion={onChangeRegion}
            />
          ))}
        </ContainerDiv>
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

const mapUsedRegionProperties = (r) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
]

export default memo(RegionSelectorSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
)
