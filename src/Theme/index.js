// @flow

import React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { makeStyles } from "@mui/styles"

const useStyles = makeStyles((theme) => ({
  container: {
    fontFamily: '"Inter", sans-serif',
  },
}))

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

export const Theme = ({ children }: any) => {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      {/* <div className={classes.container}>{children}</div> */}
      <div>{children}</div>
    </ThemeProvider>
  )
}

export default Theme
