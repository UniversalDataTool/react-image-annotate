import BackIcon from "@mui/icons-material/KeyboardArrowLeft";
import NextIcon from "@mui/icons-material/KeyboardArrowRight";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpIcon from "@mui/icons-material/Help";
import ExitIcon from "@mui/icons-material/ExitToApp";
import QueuePlayNextIcon from "@mui/icons-material/QueuePlayNext";
import HotkeysIcon from "@mui/icons-material/Keyboard";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

export const iconMapping: Record<
  string,
  OverridableComponent<SvgIconTypeMap> & {
    muiName: string;
  }
> = {
  back: BackIcon,
  prev: BackIcon,
  previous: BackIcon,
  next: NextIcon,
  forward: NextIcon,
  play: PlayIcon,
  pause: PauseIcon,
  settings: SettingsIcon,
  options: SettingsIcon,
  help: HelpIcon,
  exit: ExitIcon,
  quit: ExitIcon,
  save: ExitIcon,
  done: ExitIcon,
  clone: QueuePlayNextIcon,
  hotkeys: HotkeysIcon,
  shortcuts: HotkeysIcon,
};

export default iconMapping;
