import { Dispatch, useEffect } from "react";
import { useSettings } from "../SettingsProvider";
import { IMatrix } from "transformation-matrix-js";

type DirKeysValues = readonly [number, number];

interface DirsKeys {
  w: DirKeysValues;
  a: DirKeysValues;
  s: DirKeysValues;
  d: DirKeysValues;
}

export default ({
  getLatestMat,
  changeMat,
}: {
  getLatestMat: () => IMatrix;
  changeMat: Dispatch<IMatrix>;
}) => {
  const { wasdMode } = useSettings();
  useEffect(() => {
    if (!wasdMode) return;
    const vel = 10;
    const dirs: DirsKeys = {
      w: [0, -vel],
      a: [-vel, 0],
      s: [0, vel],
      d: [vel, 0],
    };
    const keysDown: Record<string, boolean> = {};
    const keys = Object.keys(dirs);
    const keyDownListener = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        keysDown[e.key] = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const keyUpListener = (e: KeyboardEvent) => {
      if (keys.includes(e.key)) {
        keysDown[e.key] = false;
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const interval = setInterval(() => {
      let newMat = getLatestMat().clone();
      let somethingChanged = false;
      for (const key in keysDown) {
        if (keysDown[key]) {
          const value: DirKeysValues | undefined = dirs[key as keyof DirsKeys];
          if (value) {
            newMat = newMat.translate(...value);
            somethingChanged = true;
          }
        }
      }
      if (somethingChanged) changeMat(newMat);
    }, 16);
    window.addEventListener("keydown", keyDownListener);
    window.addEventListener("keyup", keyUpListener);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", keyDownListener);
      window.removeEventListener("keyup", keyUpListener);
    };
  }, [wasdMode]);
};
