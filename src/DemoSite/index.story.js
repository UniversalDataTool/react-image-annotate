// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import DemoSite from "./"

storiesOf("DemoSite", module).add("Basic", () => <DemoSite />)
