export interface ImagePosition {
  topLeft: { x: number; y: number };
  bottomRight: { x: number; y: number };
}

export interface IconSidebarItem {
  name: string;
  helperText: string;
  alwaysShowing?: boolean;
  selected?: boolean;
  disabled?: boolean;
  onClick?: (item: IconSidebarItem) => void;
}
