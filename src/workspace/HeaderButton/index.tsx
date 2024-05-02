// @flow

import Button from "@mui/material/Button";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { useIconDictionary } from "../icon-dictionary.ts";
import { iconMapping } from "../icon-mapping.ts";
import { colors, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ReactNode } from "react";

const theme = createTheme();
const defaultNameIconMapping = iconMapping;

const getIcon = (
  name: string,
  customIconMapping: Record<string, OverridableComponent<SvgIconTypeMap>>
) => {
  const Icon =
    customIconMapping[name.toLowerCase()] ||
    defaultNameIconMapping[name.toLowerCase()] ||
    defaultNameIconMapping.help;
  return <Icon />;
};

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  width: 60,
  paddingTop: 8,
  paddingBottom: 4,
  marginLeft: 1,
  marginRight: 1,
}));
const ButtonInnerContent = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));
const IconContainer = styled("div")(
  ({ textHidden }: { textHidden: boolean }) => ({
    color: colors.grey[700],
    height: textHidden ? 32 : 20,
    paddingTop: textHidden ? 8 : 0,
    "& .MuiSvgIcon-root": {
      width: 18,
      height: 18,
    },
  })
);
const Text = styled("div")(() => ({
  fontWeight: "bold",
  fontSize: 11,
  color: colors.grey[800],
  display: "flex",
  alignItems: "center",
  lineHeight: 1,
  justifyContent: "center",
}));

interface HeaderButtonProps {
  name: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  hideText?: boolean;
}

export const HeaderButton = ({
  name,
  icon,
  disabled,
  onClick,
  hideText = false,
}: HeaderButtonProps) => {
  const customIconMapping = useIconDictionary();
  return (
    <ThemeProvider key={name} theme={theme}>
      <StyledButton onClick={onClick} disabled={disabled}>
        <ButtonInnerContent>
          <IconContainer textHidden={hideText}>
            {icon || getIcon(name, customIconMapping)}
          </IconContainer>
          {!hideText && (
            <Text>
              <div>{name}</div>
            </Text>
          )}
        </ButtonInnerContent>
      </StyledButton>
    </ThemeProvider>
  );
};

export default HeaderButton;
