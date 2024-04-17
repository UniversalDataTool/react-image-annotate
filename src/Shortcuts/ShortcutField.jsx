import React from "react"
import TextField from "@mui/material/TextField"
import { createTheme, ThemeProvider } from "@mui/material/styles"

const theme = createTheme()
const styles = {
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
}

const ShortcutField = ({ actionId, actionName, keyName, onChangeShortcut }) => {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.shortcutKeyFieldWrapper}>
        <TextField
          variant="outlined"
          label={actionName}
          sx={styles.shortcutTextfield}
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
