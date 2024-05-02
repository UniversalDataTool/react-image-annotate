// @flow

import { memo, ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SidebarBox } from "../workspace/SidebarBox";

const theme = createTheme();

interface SidebarBoxContainerProps {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  noScroll?: boolean;
  expandedByDefault?: boolean;
}

export const SidebarBoxContainer = ({
  icon,
  title,
  children,
}: SidebarBoxContainerProps) => {
  return (
    <ThemeProvider theme={theme}>
      <SidebarBox icon={icon} title={title}>
        {children}
      </SidebarBox>
    </ThemeProvider>
  );
};

export default memo(
  SidebarBoxContainer,
  (prev, next) => prev.title === next.title && prev.children === next.children
);
