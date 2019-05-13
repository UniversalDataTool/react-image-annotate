// @flow

import React from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import Button from "@material-ui/core/Button"
import Survey from "material-survey/components/Survey"
import { useSettings } from "../SettingsProvider"

export default ({ open, onClose }) => {
  const settings = useSettings()
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent style={{ minWidth: 400 }}>
        <Survey
          variant="flat"
          noActions
          defaultAnswers={settings}
          onQuestionChange={(q, a, answers) => settings.changeSetting(q, a)}
          form={{
            questions: [
              {
                type: "boolean",
                title: "Show Crosshairs",
                name: "showCrosshairs"
              }
            ]
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
