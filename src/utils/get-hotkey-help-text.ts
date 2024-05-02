import { getApplicationKeyMap } from "react-hotkeys";

export const getHotkeyHelpText = (commandName: string) => {
  const firstSequence =
    getApplicationKeyMap()[commandName]?.sequences?.[0]?.sequence;

  if (!firstSequence) return "";
  return ` (${firstSequence})`;
};

export default getHotkeyHelpText;
