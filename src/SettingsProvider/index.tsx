// @flow

import { createContext, ReactNode, useContext, useState } from "react";

interface SettingsValue {
  showCrosshairs: boolean;
  showHighlightBox: boolean;
  wasdMode: boolean;
  videoPlaybackSpeed?: string;
  changeSetting: (
    setting: keyof Omit<SettingsValue, "changeSetting">,
    value: any
  ) => void;
}

const defaultSettings: SettingsValue = {
  showCrosshairs: false,
  showHighlightBox: true,
  wasdMode: true,
  changeSetting: () => {},
};

export const SettingsContext =
  createContext<Partial<SettingsValue>>(defaultSettings);

const pullSettingsFromLocalStorage = (): Partial<SettingsValue> => {
  if (!window || !window.localStorage) return {};
  let settings: Record<string, any> = {};
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key && key?.startsWith("settings_")) {
      try {
        const value = window.localStorage.getItem(key);
        if (value) {
          settings[key.replace("settings_", "")] = JSON.parse(value);
        }
      } catch (e) {}
    }
  }
  return settings;
};

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [state, changeState] = useState<Partial<SettingsValue>>(() =>
    pullSettingsFromLocalStorage()
  );

  const changeSetting = (setting: string, value: any) => {
    changeState({ ...state, [setting]: value });
    window.localStorage.setItem(`settings_${setting}`, JSON.stringify(value));
  };

  return (
    <SettingsContext.Provider value={{ ...state, changeSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
