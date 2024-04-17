// @flow

import React from "react"
import {createTheme, ThemeProvider} from "@mui/material/styles"

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: "none",
      },
    },
  },
})

export const Theme = ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      {/* <div className={classes.container}>{children}</div> */}
      <div style={{height: "100%"}}>{children}</div>
    </ThemeProvider>
  )
}

export default Theme
