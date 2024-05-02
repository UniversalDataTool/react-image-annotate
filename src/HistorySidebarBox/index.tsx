// @flow

import { memo } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import SidebarBoxContainer from "../SidebarBoxContainer";
import HistoryIcon from "@mui/icons-material/History";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import UndoIcon from "@mui/icons-material/Undo";
import moment from "moment";
import { grey } from "@mui/material/colors";
import isEqual from "lodash/isEqual";
import { tss } from "tss-react/mui";

const theme = createTheme();
const useStyles = tss.create({
  emptyText: {
    fontSize: 14,
    fontWeight: "bold",
    color: grey[500],
    textAlign: "center",
    padding: 20,
  },
});

const listItemTextStyle = { paddingLeft: 16 };

export const HistorySidebarBox = ({
  history,
  onRestoreHistory,
}: {
  history: Array<{ name: string; time: Date }>;
  onRestoreHistory: () => void;
}) => {
  const { classes } = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title="History"
        icon={<HistoryIcon style={{ color: grey[700] }} />}
        expandedByDefault
      >
        <List>
          {history.length === 0 && (
            <div className={classes.emptyText}>No History Yet</div>
          )}
          {history.map(({ name, time }, i) => (
            <ListItemButton dense key={i}>
              <ListItemText
                style={listItemTextStyle}
                primary={name}
                secondary={moment(time).format("LT")}
              />
              {i === 0 && (
                <ListItemSecondaryAction onClick={() => onRestoreHistory()}>
                  <IconButton>
                    <UndoIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              )}
            </ListItemButton>
          ))}
        </List>
      </SidebarBoxContainer>
    </ThemeProvider>
  );
};

export default memo(HistorySidebarBox, (prevProps, nextProps) =>
  isEqual(
    prevProps.history.map((a) => [a.name, a.time]),
    nextProps.history.map((a) => [a.name, a.time])
  )
);
