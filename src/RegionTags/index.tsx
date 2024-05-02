// @flow weak

import Paper from "@mui/material/Paper";
import DefaultRegionLabel, { RegionLabelProps } from "../RegionLabel";
import LockIcon from "@mui/icons-material/Lock";
import { Region } from "../types/region-tools.ts";
import { ProjectBox, ProjectBoxFn } from "../ImageCanvas/use-project-box.ts";
import { MouseEvents } from "../ImageCanvas/use-mouse.ts";
import { ComponentType, FunctionComponent } from "react";

const copyWithout = <T extends object, K extends keyof T>(
  obj: T,
  ...args: K[]
) => {
  const newObj = { ...obj };
  for (const arg of args) {
    delete newObj[arg];
  }
  return newObj;
};

type RegionTagsProps = {
  regions: Region[];
  projectRegionBox: ProjectBoxFn;
  mouseEvents: MouseEvents;
  regionClsList?: Array<string> | Array<{ id: string; label: string }>;
  regionTagList?: string[];
  regionTagSingleSelection?: boolean;
  onBeginRegionEdit: (r: Region) => void;
  onChangeRegion: (r: Region) => void;
  onCloseRegionEdit: (r: Region) => void;
  onDeleteRegion: (r: Region) => void;
  RegionEditLabel:
    | ComponentType<RegionLabelProps>
    | FunctionComponent<RegionLabelProps>
    | null;
  onRegionClassAdded: (cls: string) => void;
  allowComments?: boolean;
};
export const RegionTags = ({
  regions,
  projectRegionBox,
  mouseEvents,
  regionClsList,
  regionTagList,
  regionTagSingleSelection,
  onBeginRegionEdit,
  onChangeRegion,
  onCloseRegionEdit,
  onDeleteRegion,
  RegionEditLabel,
  onRegionClassAdded,
  allowComments,
}: RegionTagsProps) => {
  const RegionLabel =
    RegionEditLabel != null ? RegionEditLabel : DefaultRegionLabel;
  return regions
    .filter((r) => r.visible || r.visible === undefined)
    .map((region) => {
      const pbox: ProjectBox = projectRegionBox(region);
      let margin = 8;
      if (region.highlighted && region.type === "box") margin += 6;
      const labelBoxHeight =
        region.editingLabels && !region.locked ? 170 : region.tags ? 60 : 50;
      const displayOnTop = pbox.y > labelBoxHeight;

      const coords = displayOnTop
        ? {
            left: pbox.x,
            top: pbox.y - margin / 2,
          }
        : { left: pbox.x, top: pbox.y + pbox.h + margin / 2 };
      if (region.locked) {
        return (
          <div
            key={region.id}
            style={{
              position: "absolute",
              ...coords,
              zIndex: 10 + (region.editingLabels ? 5 : 0),
            }}
          >
            <Paper
              style={{
                position: "absolute",
                left: 0,
                ...(displayOnTop ? { bottom: 0 } : { top: 0 }),
                zIndex: 10,
                backgroundColor: "#fff",
                borderRadius: 4,
                padding: 2,
                paddingBottom: 0,
                opacity: 0.5,
                pointerEvents: "none",
              }}
            >
              <LockIcon style={{ width: 16, height: 16, color: "#333" }} />
            </Paper>
          </div>
        );
      }
      return (
        <div
          key={region.id}
          style={{
            position: "absolute",
            ...coords,
            zIndex: 10 + (region.editingLabels ? 5 : 0),
            width: 200,
          }}
          onMouseDown={(e) => e.preventDefault()}
          onMouseUp={(e) => e.preventDefault()}
          onMouseEnter={(e) => {
            if (region.editingLabels) {
              mouseEvents.onMouseUp(e);
              e.button = 1;
              mouseEvents.onMouseUp(e);
            }
          }}
        >
          <div
            style={{
              position: "absolute",
              zIndex: 20,
              left: 0,
              ...(displayOnTop ? { bottom: 0 } : { top: 0 }),
            }}
            {...(!region.editingLabels
              ? copyWithout(mouseEvents, "onMouseDown", "onMouseUp")
              : {})}
          >
            <RegionLabel
              allowedClasses={regionClsList}
              allowedTags={regionTagList}
              tagSingleSelection={regionTagSingleSelection}
              onOpen={onBeginRegionEdit}
              onChange={onChangeRegion}
              onClose={onCloseRegionEdit}
              onDelete={onDeleteRegion}
              editing={region.editingLabels}
              region={region}
              onRegionClassAdded={onRegionClassAdded}
              allowComments={allowComments}
            />
          </div>
        </div>
      );
    });
};

export default RegionTags;
