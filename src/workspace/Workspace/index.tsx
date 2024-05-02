import { CSSProperties, ReactElement } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import Header from "../Header";
import RightSidebar from "../RightSidebar";
import WorkContainer from "../WorkContainer";
import { IconDictionaryContext } from "../icon-dictionary.ts";
import { useMeasure } from "react-use";
import IconSidebar from "../IconSidebar";
import { AnnotatorToolEnum } from "../../MainLayout/types.ts";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

const theme = createTheme();

const Container = styled("div")(() => ({
  display: "flex",
  width: "100%",
  flexDirection: "column",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw",
}));
const SidebarsAndContent = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  width: "100%",
  height: "100%",
  overflow: "hidden",
  maxWidth: "100vw",
}));

export interface WorkspaceProps {
  style?: CSSProperties;
  allowFullscreen?: boolean;
  hideHeader?: boolean;
  hideHeaderText?: boolean;
  headerItems?: Array<{ name: string }>;
  iconDictionary: Record<string, OverridableComponent<SvgIconTypeMap>>;
  headerLeftSide: Array<ReactElement> | null;
  rightSidebarItems: Array<ReactElement>;
  onClickHeaderItem: (item: { name: string }) => void;
  onClickIconSidebarItem: (item: { name: string }) => void;
  selectedTools: Array<AnnotatorToolEnum>;
  iconSidebarItems: Array<{
    name: string;
    helperText: string;
    alwaysShowing?: boolean;
  }>;
  rightSidebarExpanded?: boolean;
  children: ReactElement;
}

export default ({
  style = {},
  iconSidebarItems = [],
  selectedTools = ["select"],
  headerItems = [],
  rightSidebarItems = [],
  onClickHeaderItem,
  onClickIconSidebarItem,
  headerLeftSide = null,
  iconDictionary = {},
  rightSidebarExpanded,
  hideHeader = false,
  hideHeaderText = false,
  children,
}: WorkspaceProps) => {
  const [sidebarAndContentRef, sidebarAndContent] =
    useMeasure<HTMLDivElement>();
  return (
    <ThemeProvider theme={theme}>
      <IconDictionaryContext.Provider value={iconDictionary}>
        <Container style={style}>
          {!hideHeader && (
            <Header
              hideHeaderText={hideHeaderText}
              leftSideContent={headerLeftSide}
              onClickItem={onClickHeaderItem}
              items={headerItems}
            />
          )}
          <SidebarsAndContent ref={sidebarAndContentRef}>
            {iconSidebarItems.length === 0 ? null : (
              <IconSidebar
                onClickItem={onClickIconSidebarItem}
                selectedTools={selectedTools}
                items={iconSidebarItems}
              />
            )}
            <WorkContainer>{children}</WorkContainer>
            {rightSidebarItems.length === 0 ? null : (
              <RightSidebar
                initiallyExpanded={rightSidebarExpanded}
                height={sidebarAndContent.height || 0}
              >
                {rightSidebarItems}
              </RightSidebar>
            )}
          </SidebarsAndContent>
        </Container>
      </IconDictionaryContext.Provider>
    </ThemeProvider>
  );
};
