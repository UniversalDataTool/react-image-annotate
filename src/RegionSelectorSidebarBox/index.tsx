// @flow

import { memo, ReactNode } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { blue, grey } from "@mui/material/colors";
import RegionIcon from "@mui/icons-material/PictureInPicture";
import Grid from "@mui/material/Grid";
import ReorderIcon from "@mui/icons-material/SwapVert";
import TrashIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import UnlockIcon from "@mui/icons-material/LockOpen";
import VisibleIcon from "@mui/icons-material/Visibility";
import VisibleOffIcon from "@mui/icons-material/VisibilityOff";
import classnames from "classnames";
import isEqual from "lodash/isEqual";
import { Region } from "../types/region-tools.ts";
import { tss } from "tss-react/mui";
import { RegionAllowedActions } from "../MainLayout/types.ts";

const theme = createTheme();
const useStyles = tss.create({
  container: {
    fontSize: 11,
    fontWeight: "bold",
    color: grey[700],
    "& .icon": {
      marginTop: 4,
      width: 16,
      height: 16,
    },
    "& .icon2": {
      opacity: 0.5,
      width: 16,
      height: 16,
      transition: "200ms opacity",
      "&:hover": {
        cursor: "pointer",
        opacity: 1,
      },
    },
  },
  row: {
    padding: 4,
    cursor: "pointer",
    "&.header:hover": {
      backgroundColor: "#fff",
    },
    "&.highlighted": {
      backgroundColor: blue[100],
    },
    "&:hover": {
      backgroundColor: blue[50],
      color: grey[800],
    },
  },
  chip: {
    display: "flex",
    flexDirection: "row",
    padding: 2,
    borderRadius: 2,
    paddingLeft: 4,
    paddingRight: 4,
    alignItems: "center",
    "& .color": {
      borderRadius: 5,
      width: 10,
      minWidth: 10,
      height: 10,
      marginRight: 4,
    },
    "& .text": {},
  },
});

const HeaderSep = styled("div")(() => ({
  borderTop: `1px solid ${grey[200]}`,
  marginTop: 2,
  marginBottom: 2,
}));

interface ChipProps {
  color: string;
  text: string;
}

const Chip = ({ color, text }: ChipProps) => {
  const { classes } = useStyles();
  return (
    <span className={classes.chip}>
      <div className="color" style={{ backgroundColor: color }} />
      <div className="text">{text}</div>
    </span>
  );
};

interface RowLayoutProps {
  header: boolean;
  highlighted: boolean;
  order: ReactNode;
  classification: ReactNode;
  trash: ReactNode;
  lock: ReactNode;
  visible: ReactNode;
  onClick?: () => void;
}

const RowLayout = ({
  header,
  highlighted,
  order,
  classification,
  trash,
  lock,
  visible,
  onClick,
}: RowLayoutProps) => {
  const { classes } = useStyles();
  return (
    <div
      onClick={onClick}
      className={classnames(classes.row, { header, highlighted })}
    >
      <Grid container alignItems="center">
        <Grid item xs={2}>
          <div style={{ textAlign: "right", paddingRight: 10 }}>{order}</div>
        </Grid>
        <Grid item xs={5} style={{ marginRight: "auto" }}>
          {classification}
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
    </div>
  );
};

const RowHeader = ({
  regionAllowedActions,
}: {
  regionAllowedActions: RegionAllowedActions;
}) => {
  return (
    <RowLayout
      header
      highlighted={false}
      order={<ReorderIcon className="icon" />}
      classification={<div style={{ paddingLeft: 10 }}>Class</div>}
      trash={
        regionAllowedActions.remove ? <TrashIcon className="icon" /> : null
      }
      lock={regionAllowedActions.lock ? <LockIcon className="icon" /> : null}
      visible={
        regionAllowedActions.visibility ? (
          <VisibleIcon className="icon" />
        ) : null
      }
    />
  );
};

const MemoRowHeader = memo(RowHeader);

interface RowProps {
  region: Region;
  regionClsList?: Array<{ id: string; label: string }> | string[];
  regionAllowedActions: RegionAllowedActions;
  highlighted?: boolean;
  onSelectRegion: (r: Region) => void;
  onDeleteRegion: (r: Region) => void;
  onChangeRegion: (r: Region) => void;
  visible?: boolean;
  locked?: boolean;
  color: string;
  cls?: string;
  index: number;
  rId: string | number;
}

const Row = ({
  region: r,
  regionClsList,
  highlighted,
  onSelectRegion,
  onDeleteRegion,
  onChangeRegion,
  color,
  cls,
  index,
  regionAllowedActions,
}: RowProps) => {
  const selectedCls = regionClsList?.find(
    (c) => typeof c === "object" && c.id === cls
  );
  const clsLabel =
    selectedCls && typeof selectedCls === "object" ? selectedCls.label : cls;
  return (
    <RowLayout
      header={false}
      highlighted={highlighted || false}
      onClick={() => onSelectRegion(r)}
      order={`#${index + 1}`}
      classification={<Chip text={clsLabel || ""} color={color || "#ddd"} />}
      trash={
        regionAllowedActions.remove ? (
          <TrashIcon onClick={() => onDeleteRegion(r)} className="icon2" />
        ) : null
      }
      lock={
        regionAllowedActions.lock ? (
          r.locked ? (
            <LockIcon
              onClick={() => onChangeRegion({ ...r, locked: false })}
              className="icon2"
            />
          ) : (
            <UnlockIcon
              onClick={() => onChangeRegion({ ...r, locked: true })}
              className="icon2"
            />
          )
        ) : null
      }
      visible={
        regionAllowedActions.visibility ? (
          r.visible || r.visible === undefined ? (
            <VisibleIcon
              onClick={() => onChangeRegion({ ...r, visible: false })}
              className="icon2"
            />
          ) : (
            <VisibleOffIcon
              onClick={() => onChangeRegion({ ...r, visible: true })}
              className="icon2"
            />
          )
        ) : null
      }
    />
  );
};

const MemoRow = memo(
  Row,
  (prevProps, nextProps) =>
    prevProps.highlighted === nextProps.highlighted &&
    prevProps.visible === nextProps.visible &&
    prevProps.locked === nextProps.locked &&
    prevProps.rId === nextProps.rId &&
    prevProps.index === nextProps.index &&
    prevProps.cls === nextProps.cls &&
    prevProps.color === nextProps.color
);

const emptyArr: Region[] = [];

interface RegionSelectorSidebarBoxProps {
  regions?: Region[];
  regionClsList?: Array<{ id: string; label: string }> | string[];
  regionAllowedActions: RegionAllowedActions;
  onDeleteRegion: (r: Region) => void;
  onChangeRegion: (r: Region) => void;
  onSelectRegion: (r: Region) => void;
}

export const RegionSelectorSidebarBox = ({
  regions = emptyArr,
  regionClsList,
  onDeleteRegion,
  onChangeRegion,
  onSelectRegion,
  regionAllowedActions,
}: RegionSelectorSidebarBoxProps) => {
  const { classes } = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Regions"
        icon={<RegionIcon style={{ color: grey[700] }} />}
        expandedByDefault
      >
        <div className={classes.container}>
          <MemoRowHeader regionAllowedActions={regionAllowedActions} />
          <HeaderSep />
          {regions.map((r, i) => (
            <MemoRow
              key={r.id}
              rId={r.id}
              {...r}
              regionClsList={regionClsList}
              region={r}
              index={i}
              regionAllowedActions={regionAllowedActions}
              onSelectRegion={onSelectRegion}
              onDeleteRegion={onDeleteRegion}
              onChangeRegion={onChangeRegion}
            />
          ))}
        </div>
      </SidebarBoxContainer>
    </ThemeProvider>
  );
};

const mapUsedRegionProperties = (r: Region) => [
  r.id,
  r.color,
  r.locked,
  r.visible,
  r.highlighted,
];

export default memo(RegionSelectorSidebarBox, (prevProps, nextProps) =>
  isEqual(
    (prevProps.regions || emptyArr).map(mapUsedRegionProperties),
    (nextProps.regions || emptyArr).map(mapUsedRegionProperties)
  )
);
