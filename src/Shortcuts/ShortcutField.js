import React from "react"
import TextField from "@mui/material/TextField"
import { makeStyles } from "@mui/styles"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme()
const useStyles = makeStyles((theme) => ({
  shortcutKeyFieldWrapper: {
    paddingTop: 8,
    display: "inline-flex",
    width: "100%",
  },
  shortcutKeyText: {
    lineHeight: 0,
  },
  shortcutTextfield: {
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
  },
}))

const ShortcutField = ({ actionId, actionName, keyName, onChangeShortcut }) => {
  const classes = useStyles()

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.shortcutKeyFieldWrapper}>
        <TextField
          variant="outlined"
          label={actionName}
          className={classes.shortcutTextfield}
          value={keyName}
          onKeyPress={(e) => {
            onChangeShortcut(actionId, e.key)
            e.stopPropagation()
          }}
        />
      </div>
    </ThemeProvider>
  )
}

export default ShortcutField
