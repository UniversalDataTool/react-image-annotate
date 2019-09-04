// @flow

import React from "react"
import ReactDOM from "react-dom"
import Theme from "./Theme"
import DemoSite from "./DemoSite"

ReactDOM.render(
  <Theme>
    <DemoSite />
  </Theme>,
  document.getElementById("root")
)
