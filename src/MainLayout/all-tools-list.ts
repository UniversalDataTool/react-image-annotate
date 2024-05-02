import getHotkeyHelpText from "../utils/get-hotkey-help-text.ts";
import { IconSidebarItem } from "../types/common.ts";

export const ALL_TOOLS: IconSidebarItem[] = [
  {
    name: "select",
    helperText: "Select" + getHotkeyHelpText("select_tool"),
    alwaysShowing: true,
  },
  {
    name: "pan",
    helperText:
      "Drag/Pan (right or middle click)" + getHotkeyHelpText("pan_tool"),
    alwaysShowing: true,
  },
  {
    name: "zoom",
    helperText: "Zoom In/Out (scroll)" + getHotkeyHelpText("zoom_tool"),
    alwaysShowing: true,
  },
  {
    name: "show-tags",
    helperText: "Show / Hide Tags",
    alwaysShowing: true,
  },
  {
    name: "create-point",
    helperText: "Add Point" + getHotkeyHelpText("create_point"),
  },
  {
    name: "create-box",
    helperText: "Add Bounding Box" + getHotkeyHelpText("create_bounding_box"),
  },
  {
    name: "create-polygon",
    helperText: "Add Polygon" + getHotkeyHelpText("create_polygon"),
  },
  {
    name: "create-line",
    helperText: "Add Line",
  },
  {
    name: "create-expanding-line",
    helperText: "Add Expanding Line",
  },
  {
    name: "create-keypoints",
    helperText: "Add Keypoints (Pose)",
  },
  {
    name: "show-mask",
    alwaysShowing: true,
    helperText: "Show / Hide Mask",
  },
  {
    name: "modify-allowed-area",
    helperText: "Modify Allowed Area",
  },
];
