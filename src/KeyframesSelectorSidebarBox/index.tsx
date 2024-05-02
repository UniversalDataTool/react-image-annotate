// @flow weak

import AddLocationIcon from "@mui/icons-material/AddLocation";
import SidebarBoxContainer from "../SidebarBoxContainer";
import * as colors from "@mui/material/colors";
import getTimeString from "../KeyframeTimeline/get-time-string";
import TrashIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MainLayoutVideoAnnotationState } from "../MainLayout/types.ts";

const theme = createTheme();
const KeyframeRow = styled("div")(() => ({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: 8,
  fontSize: 14,
  color: colors.grey[700],
  width: "100%",
  "&.current": {
    backgroundColor: colors.blue[100],
  },
  "&:hover": {
    backgroundColor: colors.grey[100],
  },
  "& .time": {
    flexGrow: 1,
    fontWeight: "bold",
    "& .regionCount": {
      marginLeft: 8,
      fontWeight: "normal",
      color: colors.grey[500],
    },
  },
  "& .trash": {
    "& .icon": {
      fontSize: 18,
      color: colors.grey[600],
      transition: "transform 80ms",
      "&:hover": {
        color: colors.grey[800],
        transform: "scale(1.25,1.25)",
      },
    },
  },
}));

interface KeyframesSelectorSidebarBoxProps {
  currentVideoTime?: number;
  keyframes: MainLayoutVideoAnnotationState["keyframes"];
  onChangeVideoTime: (time: number) => void;
  onDeleteKeyframe: (time: number) => void;
}
const KeyframesSelectorSidebarBox = ({
  currentVideoTime,
  keyframes,
  onChangeVideoTime,
  onDeleteKeyframe,
}: KeyframesSelectorSidebarBoxProps) => {
  const keyframeTimes = Object.keys(keyframes).map((t) => parseInt(t));

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="Keyframes"
        icon={<AddLocationIcon style={{ color: colors.grey[700] }} />}
        expandedByDefault
      >
        {keyframeTimes.map((t) => (
          <KeyframeRow
            key={t}
            className={currentVideoTime === t ? "current" : ""}
            onClick={() => onChangeVideoTime(t)}
          >
            <div className="time">
              {getTimeString(t, 2)}
              <span className="regionCount">
                ({(keyframes[t]?.regions || []).length})
              </span>
            </div>
            <div className="trash">
              <TrashIcon
                onClick={(e) => {
                  onDeleteKeyframe(t);
                  e.stopPropagation();
                }}
                className="icon"
              />
            </div>
          </KeyframeRow>
        ))}
      </SidebarBoxContainer>
    </ThemeProvider>
  );
};

export default KeyframesSelectorSidebarBox;
