// @flow

import React from "react"

import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"

import RemoveScrollOnChildren from "./"

storiesOf("RemoveScrollOnChildren", module).add("Basic", () => (
  <div style={{ width: "100vh", textAlign: "center", height: "200vh" }}>
    <RemoveScrollOnChildren>
      <div
        style={{
          display: "inline-block",
          width: 100,
          height: 100,
          backgroundColor: "red",
        }}
      />
    </RemoveScrollOnChildren>
  </div>
))
