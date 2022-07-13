import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Survey from "material-survey/components/Survey";
import { useSettings } from "../SettingsProvider";
export var SettingsDialog = function SettingsDialog(_ref) {
  var open = _ref.open,
      onClose = _ref.onClose;
  var settings = useSettings();
  return React.createElement(Dialog, {
    open: open || false,
    onClose: onClose
  }, React.createElement(DialogTitle, null, "Settings"), React.createElement(DialogContent, {
    style: {
      minWidth: 400
    }
  }, React.createElement(Survey, {
    variant: "flat",
    noActions: true,
    defaultAnswers: settings,
    onQuestionChange: function onQuestionChange(q, a, answers) {
      return settings.changeSetting(q, a);
    },
    form: {
      questions: [{
        type: "boolean",
        title: "Show Crosshairs",
        name: "showCrosshairs"
      }, {
        type: "boolean",
        title: "Show Highlight Box",
        name: "showHighlightBox"
      }, {
        type: "boolean",
        title: "WASD Mode",
        name: "wasdMode"
      }, {
        type: "dropdown",
        title: "Video Playback Speed",
        name: "videoPlaybackSpeed",
        defaultValue: "1x",
        choices: ["0.25x", "0.5x", "1x", "2x"]
      }]
    }
  })), React.createElement(DialogActions, null, React.createElement(Button, {
    onClick: onClose
  }, "Close")));
};
export default SettingsDialog;