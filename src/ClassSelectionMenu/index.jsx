import React, {useEffect} from "react"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import Box from "@mui/material/Box"
import * as muiColors from "@mui/material/colors"
import SidebarBoxContainer from "../SidebarBoxContainer"
import colors from "../colors"
import BallotIcon from "@mui/icons-material/Ballot"
import capitalize from "lodash/capitalize"
import classnames from "classnames"
import {useTranslation} from "react-i18next"

const theme = createTheme()
const LabelContainer = styled("div")(({theme}) => ({
  display: "flex",
  paddingTop: 4,
  paddingBottom: 4,
  paddingLeft: 16,
  paddingRight: 16,
  alignItems: "center",
  cursor: "pointer",
  opacity: 0.7,
  backgroundColor: "#fff",
  "&:hover": {
    opacity: 1,
  },
  "&.selected": {
    opacity: 1,
    fontWeight: "bold",
  },
}))
const Circle = styled("div")(({theme}) => ({
  width: 12,
  height: 12,
  borderRadius: 12,
  marginRight: 8,
}))
const Label = styled("div")(({theme}) => ({
  fontSize: 11,
}))
const DashSep = styled("div")(({theme}) => ({
  flexGrow: 1,
  borderBottom: `2px dotted ${muiColors.grey[300]}`,
  marginLeft: 8,
  marginRight: 8,
}))
const Number = styled("div")(({theme}) => ({
  fontSize: 11,
  textAlign: "center",
  minWidth: 14,
  paddingTop: 2,
  paddingBottom: 2,
  fontWeight: "bold",
  color: muiColors.grey[700],
}))

export const ClassSelectionMenu = ({
  selectedCls,
  preselectCls,
  regionClsList,
  regionColorList,
  onSelectCls,
}) => {

  useEffect(() => {
    if (selectedCls == null) {
      if (preselectCls != null) {
        onSelectCls(preselectCls);
      } else {
        onSelectCls(regionClsList[0]);
      }
    }
  }, [])

  const {t} = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <SidebarBoxContainer
        title={t("menu.classifications")}
        subTitle=""
        icon={<BallotIcon style={{color: muiColors.grey[700]}} />}
        expandedByDefault
        noScroll={true}
      >
        {regionClsList.map((label, index) => (
          <LabelContainer
            key={"regionCls" + label}
            className={classnames({selected: label === selectedCls})}
            onClick={() => onSelectCls(label)}
          >
            <Circle
              style={{backgroundColor: index < regionColorList.length ? regionColorList[index] : colors[index % colors.length]}}
            />
            <Label className={classnames({selected: label === selectedCls})}>
              {capitalize(label)}
            </Label>
            <DashSep />
          </LabelContainer>
        ))}
        <Box pb={2} />
      </SidebarBoxContainer>
    </ThemeProvider>
  )
}

export default ClassSelectionMenu
