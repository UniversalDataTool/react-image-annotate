// @flow

import { ReactNode, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import useEventCallback from "use-event-callback";

const theme = createTheme();
const Container = styled("div")(() => ({
  "& > div": {
    width: "100%",
    height: "100%",
  },
}));

interface PreventScrollToParentsProps {
  children: ReactNode;

  [key: string]: any;
}

export const PreventScrollToParents = ({
  children,
  ...otherProps
}: PreventScrollToParentsProps) => {
  const [mouseOver, changeMouseOver] = useState(false);
  const onMouseMove = useEventCallback((e) => {
    if (!mouseOver) changeMouseOver(true);
    if (otherProps.onMouseMove) {
      otherProps.onMouseMove(e);
    }
  });
  const onMouseLeave = useEventCallback(() => {
    setTimeout(() => {
      if (mouseOver) {
        changeMouseOver(false);
      }
    }, 100);
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        {...otherProps}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <RemoveScroll enabled={mouseOver} removeScrollBar={false}>
          {children}
        </RemoveScroll>
      </Container>
    </ThemeProvider>
  );
};

export default PreventScrollToParents;
