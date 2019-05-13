// @flow

import React from "react"
import Theme from "../src/Theme"
import { configure, addDecorator } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import SettingsProvider from "../src/SettingsProvider"

addDecorator(storyFn => <Theme>{storyFn()}</Theme>)
// addDecorator(storyFn => <SettingsProvider>{storyFn()}</SettingsProvider>)

function loadStories() {
  require("../src/stories")
}

configure(loadStories, module)
