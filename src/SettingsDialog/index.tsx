// @flow

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import { useSettings } from "../SettingsProvider";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const bollEnum = {
  YES: "1",
  NO: "2",
};

const getBooleanConditionValue = (value: string) => {
  return value === bollEnum.YES;
};

const getBooleanConditionValueString = (value: boolean | undefined) => {
  return value ? bollEnum.YES : bollEnum.NO;
};

const booleanCondition = [
  {
    value: bollEnum.YES,
    label: "Yes",
  },
  {
    value: bollEnum.NO,
    label: "No",
  },
];

const videoPlaybackSpeeds = ["0.25x", "0.5x", "1x", "2x"];

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
  const settings = useSettings();
  const [showCrosshairs, setShowCrosshairs] = useState(
    getBooleanConditionValueString(settings.showCrosshairs)
  );
  const [showHighlightBox, setShowHighlightBox] = useState(
    getBooleanConditionValueString(settings.showHighlightBox)
  );
  const [wasdMode, setWasdMode] = useState(
    getBooleanConditionValueString(settings.wasdMode)
  );
  const [videoPlaybackSpeed, setVideoPlaybackSpeed] = useState(
    settings.videoPlaybackSpeed ?? videoPlaybackSpeeds[2]
  );

  return (
    <Dialog open={open || false} onClose={onClose}>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent style={{ minWidth: 400 }}>
        <FormControl fullWidth>
          <FormLabel id="row-radio-buttons-group-label">
            Show Crosshairs
          </FormLabel>
          <RadioGroup
            row
            value={showCrosshairs}
            aria-labelledby="row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(_, value) => {
              setShowCrosshairs(value);
              if (settings.changeSetting) {
                const newValue = getBooleanConditionValue(value);
                settings.changeSetting("showCrosshairs", newValue);
              }
            }}
          >
            {booleanCondition.map((condition) => (
              <FormControlLabel
                key={condition.value}
                value={condition.value}
                control={<Radio />}
                label={condition.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel id="row-radio-buttons-group-label">
            Show Highlight Box
          </FormLabel>
          <RadioGroup
            row
            value={showHighlightBox}
            aria-labelledby="row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(_, value) => {
              setShowHighlightBox(value);
              if (settings.changeSetting) {
                const newValue = getBooleanConditionValue(value);
                settings.changeSetting("showHighlightBox", newValue);
              }
            }}
          >
            {booleanCondition.map((condition) => (
              <FormControlLabel
                key={condition.value}
                value={condition.value}
                control={<Radio />}
                label={condition.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth>
          <FormLabel id="row-radio-buttons-group-label">WASD Mode</FormLabel>
          <RadioGroup
            row
            value={wasdMode}
            aria-labelledby="row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(_, value) => {
              setWasdMode(value);
              if (settings.changeSetting) {
                const newValue = getBooleanConditionValue(value);
                settings.changeSetting("wasdMode", newValue);
              }
            }}
          >
            {booleanCondition.map((condition) => (
              <FormControlLabel
                key={condition.value}
                value={condition.value}
                control={<Radio />}
                label={condition.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="simple-select-label">Video Playback Speed</InputLabel>
          <Select
            labelId="simple-select-label"
            id="simple-select"
            value={videoPlaybackSpeed}
            label="Video Playback Speed"
            onChange={(v) => {
              const newValue = v.target.value;
              setVideoPlaybackSpeed(newValue);
              if (settings.changeSetting) {
                settings.changeSetting("videoPlaybackSpeed", newValue);
              }
            }}
          >
            {videoPlaybackSpeeds.map((speed) => (
              <MenuItem key={speed} value={speed}>
                {speed}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
