import React from "react"
import TextField from "@material-ui/core/TextField"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
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
})

const ShortcutField = ({ actionId, actionName, keyName, onChangeShortcut }) => {
  const classes = useStyles()

  return (
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
  )
}

export default ShortcutField
