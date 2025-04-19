import HeaderButton from "../HeaderButton/index.js";
import Box from "@mui/material/Box";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { forwardRef, ReactNode, useImperativeHandle, useRef } from "react";

const theme = createTheme();

const Container = styled("div")(() => ({
  width: "100%",
  display: "flex",
  backgroundColor: "#fff",
  borderBottom: "1px solid #ccc",
  alignItems: "center",
  flexShrink: 1,
  boxSizing: "border-box",
}));

interface HeaderProps {
  leftSideContent?: ReactNode;
  hideHeaderText?: boolean;
  items: Array<{ name: string }>;
  onClickItem: (item: { name: string }) => void;
  customeHeaderItem?: {
    icon: React.ReactNode,
    name: string,
    onClickAction: () => void
  }
}

export type HeaderRef = {
  clickButtonByName: (name: string) => void;
};

export const Header = forwardRef<HeaderRef, HeaderProps>(({
  leftSideContent = null,
  hideHeaderText = false,
  items,
  onClickItem,
  customeHeaderItem
}, ref) => {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useImperativeHandle(ref, () => ({
      clickButtonByName(name: string) {
        const button = buttonRefs.current[name];
        if (button) {
          button.click();
        } else {
          console.warn(`No button found with name: ${name}`);
        }
      },
    }));

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box flexGrow={1}>{leftSideContent}</Box>
        {items.map((item, index) => (
          <HeaderButton
            key={`${item.name}-${index}`}
            ref={(el: HTMLButtonElement | null) => {
              buttonRefs.current[item.name] = el;
            }}
            hideText={hideHeaderText}
            onClick={() => onClickItem(item)}
            {...item}
          />
        ))}
        {customeHeaderItem ? (
          <HeaderButton
            key="customHeader"
            ref={(el: HTMLButtonElement | null) => {
              buttonRefs.current[customeHeaderItem.name] = el;
            }}
            hideText={hideHeaderText}
            onClick={() => customeHeaderItem.onClickAction()}
            name={customeHeaderItem.name}
            icon={customeHeaderItem.icon}
          />
        ): <></>}
      </Container>
    </ThemeProvider>
  );
});

export default Header;
