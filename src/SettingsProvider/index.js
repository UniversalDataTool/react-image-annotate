// @flow

import React, { createContext, useContext, useState } from "react"

const defaultSettings = {
  showCrosshairs: false,
  showHighlightBox: true,
  wasdMode: true,
}

export const SettingsContext = createContext(defaultSettings)

const pullSettingsFromLocalStorage = () => {
  if (!window || !window.localStorage) return {}
  let settings = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i)
    if (key.startsWith("settings_")) {
      try {
        settings[key.replace("settings_", "")] = JSON.parse(
          window.localStorage.getItem(key)
        )
      } catch (e) {}
    }
  }
  return settings
}

export const useSettings = () => useContext(SettingsContext)

export const SettingsProvider = ({ children }) => {
  const [state, changeState] = useState(() => pullSettingsFromLocalStorage())
  const changeSetting = (setting: string, value: any) => {
    changeState({ ...state, [setting]: value })
    window.localStorage.setItem(`settings_${setting}`, JSON.stringify(value))
  }
  return (
    <SettingsContext.Provider value={{ ...state, changeSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export default SettingsProvider
