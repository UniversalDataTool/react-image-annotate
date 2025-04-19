import { EffectCallback, useEffect } from "react";

import { convertToAsciiEquivalent, getAsciiCode, onKeyPress } from "./keys";

const VALID_KEY_EVENTS = ["keydown", "keyup", "keypress"];

interface IParamType {
  detectKeys: Array<string | number>;
  keyevent?: "keydown" | "keyup" | "keypress";
}

const useKey = (
  callback: (currentKeyCode: number, event: Event) => unknown,
  { detectKeys, keyevent }: IParamType,
  { dependencies = [] } = {}
): any => {
  const event = keyevent || "keydown";
  const isKeyeventValid = VALID_KEY_EVENTS.indexOf(event) > -1;

  if (!isKeyeventValid) {
    // eslint-disable-next-line no-console
    throw new Error(`Invalid keyevent ${keyevent}. Defaulting to keydown`);
  }

  if (!callback) {
    throw new Error("Callback is required");
  }

  if (!Array.isArray(dependencies)) {
    throw new Error("Dependencies should be an array");
  }

  let allowedKeys = detectKeys;

  if (!Array.isArray(detectKeys)) {
    allowedKeys = [];
    // eslint-disable-next-line no-console
    console.warn("Keys should be array!");
  }

  allowedKeys = convertToAsciiEquivalent(allowedKeys);

  const handleEvent = (event: Event) => {
    const asciiCode = getAsciiCode(event);
    return onKeyPress(asciiCode, callback, allowedKeys, event);
  };

  useEffect((): ReturnType<EffectCallback> => {
    const canUseDOM = !!(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );
    if (!canUseDOM) {
      console.error("Window is not defined");
      return (): void => {
        // returning null
      };
    }
    window.document.addEventListener(event, handleEvent);
    return () => {
      window.document.removeEventListener(event, handleEvent);
    };
  }, dependencies);
};

export { useKey };
