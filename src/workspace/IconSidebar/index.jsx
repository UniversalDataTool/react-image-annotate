import React from "react"
import { createTheme, styled, ThemeProvider } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import { iconMapping } from "../icon-mapping.js"
import { useIconDictionary } from "../icon-dictionary.js"
import Tooltip from "@mui/material/Tooltip"

const theme = createTheme()
const Container = styled("div")(({ theme }) => ({
  width: 50,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#fff",
  flexShrink: 0,
}))

const emptyAr = []

export const IconSidebar = ({
  items = emptyAr,
  onClickItem,
  selectedTools = emptyAr,
}) => {
  const customIconMapping = useIconDictionary()
  return (
    <ThemeProvider theme={theme}>
      <Container>
        {items.map((item) => {
          let NameIcon =
            customIconMapping[item.name.toLowerCase()] ||
            iconMapping[item.name.toLowerCase()] ||
            iconMapping["help"]

          const buttonPart = (
            <IconButton
              key={item.name}
              color={
                item.selected || selectedTools.includes(item.name.toLowerCase())
                  ? "primary"
                  : "default"
              }
              disabled={Boolean(item.disabled)}
              onClick={item.onClick ? item.onClick : () => onClickItem(item)}
            >
              {item.icon || <NameIcon />}
            </IconButton>
          )

          if (!item.helperText) return buttonPart

          return (
            <Tooltip key={item.name} title={item.helperText} placement="right">
              {buttonPart}
            </Tooltip>
          )
        })}
      </Container>
    </ThemeProvider>
  )
}

export default IconSidebar
