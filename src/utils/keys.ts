import { EffectCallback } from "react";

const codeLowerCaseA = 65;
const codeUpperCaseZ = 122;
const isKeyFromGivenList = (
  keyCode: number,
  allowedKeys: Array<string | number> = []
): boolean => {
  if (
    allowedKeys === null ||
    allowedKeys.includes(keyCode) ||
    allowedKeys.length === 0
  ) {
    return true;
  }
  return false;
};
const onKeyPress = (
  currentKeyCode: number,
  callback: (currentKeyCode: number, event: Event) => unknown,
  allowedKeys: Array<string | number>,
  event: Event
): ReturnType<EffectCallback> => {
  if (isKeyFromGivenList(currentKeyCode, allowedKeys)) {
    callback(currentKeyCode, event);
  }
};

function getAsciiCode(event: Event): number {
  let keyCode = (event as KeyboardEvent).which;
  if (keyCode >= codeLowerCaseA && keyCode <= codeUpperCaseZ) {
    keyCode = (event as KeyboardEvent).key.charCodeAt(0);
  }
  return keyCode;
}

function convertToAsciiEquivalent(
  inputArray: Array<string | number>
): Array<string | number> {
  return inputArray.map((item) => {
    const finalVal = item;
    if (typeof finalVal === "string") {
      return finalVal.charCodeAt(0);
    }
    return finalVal;
  });
}

export {
  isKeyFromGivenList,
  onKeyPress,
  convertToAsciiEquivalent,
  getAsciiCode,
};
