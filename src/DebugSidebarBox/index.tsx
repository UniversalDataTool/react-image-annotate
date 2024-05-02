// @flow

import SidebarBoxContainer from "../SidebarBoxContainer";
import { Action, MainLayoutState } from "../MainLayout/types.ts";

interface DebugSidebarBoxProps {
  state: MainLayoutState;
  lastAction: Action | undefined;
}

export const DebugSidebarBox = ({
  state,
  lastAction,
}: DebugSidebarBoxProps) => {
  const image =
    state.annotationType === "image" && state.selectedImage
      ? (state.images || [])[state.selectedImage]
      : null;
  const region = image
    ? (image.regions || []).filter((r) => r.highlighted)
    : null;

  return (
    <SidebarBoxContainer title="Debug" icon={<span />} expandedByDefault>
      <div style={{ padding: 4 }}>
        <div>
          <b>region</b>:
        </div>
        <pre>{JSON.stringify(region, null, "  ")}</pre>
        <div>
          <b>lastAction</b>:
        </div>
        <pre>{JSON.stringify(lastAction, null, "  ")}</pre>
        <div>
          <b>mode</b>:
        </div>
        <pre>{JSON.stringify(state.mode, null, "  ")}</pre>
        <div>
          <b>frame:</b>
        </div>
        <pre>
          {"selectedImageFrameTime" in state
            ? JSON.stringify(state.selectedImageFrameTime, null, "  ")
            : null}
        </pre>
      </div>
    </SidebarBoxContainer>
  );
};

export default DebugSidebarBox;
