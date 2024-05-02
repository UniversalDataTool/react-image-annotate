// @flow

import { memo, ReactNode, useCallback, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import ExpandIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import useEventCallback from "use-event-callback";
import Typography from "@mui/material/Typography";
import { useIconDictionary } from "../icon-dictionary.ts";
import { grey } from "@mui/material/colors";
import classnames from "classnames";

const theme = createTheme();
const ContainerDiv = styled("div")(() => ({
  borderBottom: `2px solid ${grey[400]}`,
  "&:firstChild": { borderTop: `1px solid ${grey[400]}` },
}));
const HeaderDiv = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  padding: 4,
  paddingLeft: 16,
  paddingRight: 12,
  "& .iconContainer": {
    color: grey[600],
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiSvgIcon-root": {
      width: 16,
      height: 16,
    },
  },
}));
const ContentDiv = styled("div")(() => ({
  maxHeight: 200,
  overflowY: "auto",
  "&.noScroll": {
    overflowY: "visible",
    overflow: "visible",
  },
}));
const TitleTypography = styled(Typography)(() => ({
  fontSize: 11,
  flexGrow: 1,
  fontWeight: 800,
  paddingLeft: 8,
  color: grey[800],
  "& span": {
    color: grey[600],
    fontSize: 11,
  },
}));

const getExpandedFromLocalStorage = (title: string) => {
  try {
    return JSON.parse(
      window.localStorage[`__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`]
    );
  } catch (e) {
    return false;
  }
};
const setExpandedInLocalStorage = (title: string, expanded: boolean) => {
  window.localStorage[`__REACT_WORKSPACE_SIDEBAR_EXPANDED_${title}`] =
    JSON.stringify(expanded);
};

interface SidebarBoxProps {
  icon?: ReactNode;
  title: string;
  subTitle?: string;
  children: ReactNode;
  noScroll?: boolean;
  expandedByDefault?: boolean;
}

export const SidebarBox = ({
  icon,
  title,
  subTitle,
  children,
  noScroll = false,
  expandedByDefault,
}: SidebarBoxProps) => {
  const content = (
    <ContentDiv className={classnames(noScroll && "noScroll")}>
      {children}
    </ContentDiv>
  );

  const [expanded, changeExpandedState] = useState(
    expandedByDefault === undefined
      ? getExpandedFromLocalStorage(title)
      : expandedByDefault
  );
  const changeExpanded = useCallback(
    (expanded: boolean) => {
      changeExpandedState(expanded);
      setExpandedInLocalStorage(title, expanded);
    },
    [changeExpandedState, title]
  );

  const toggleExpanded = useEventCallback(() => changeExpanded(!expanded));
  const customIconMapping = useIconDictionary();
  const TitleIcon = customIconMapping[title.toLowerCase()];
  return (
    <ThemeProvider theme={theme}>
      <ContainerDiv>
        <HeaderDiv>
          <div className="iconContainer">{icon || <TitleIcon />}</div>
          <TitleTypography>
            {title} <span>{subTitle}</span>
          </TitleTypography>
          <IconButton
            onClick={toggleExpanded}
            sx={{
              padding: 0,
              width: 30,
              height: 30,
              "& .icon": {
                width: 20,
                height: 20,
                transition: "500ms transform",
                "&.expanded": {
                  transform: "rotate(180deg)",
                },
              },
            }}
          >
            <ExpandIcon
              className={classnames("icon", expanded && "expanded")}
            />
          </IconButton>
        </HeaderDiv>
        {noScroll ? (
          expanded ? (
            content
          ) : null
        ) : (
          <Collapse in={expanded}>
            <div
              className="panel"
              style={{ display: "block", overflow: "hidden", height: 200 }}
            >
              {content}
            </div>
          </Collapse>
        )}
      </ContainerDiv>
    </ThemeProvider>
  );
};

export default memo(
  SidebarBox,
  (prev, next) => prev.title === next.title && prev.children === next.children
);
