// @flow

import React from "react"
import Theme from "../src/Theme"
import { configure, addDecorator } from "@storybook/react"
import { action } from "@storybook/addon-actions"

addDecorator(storyFn => <Theme>{storyFn()}</Theme>)

function loadStories() {
  require("../src/stories")
}

configure(loadStories, module)
