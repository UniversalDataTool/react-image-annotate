// @flow
import React from "react"
import {createRoot} from "react-dom/client"
import Theme from "./Theme"
import DemoSite from "./DemoSite"
import "./site.css"


const Site = () => {
  const path = window.location.pathname
    .replace(/\/$/, "")
    .split("/")
    .slice(-1)[0]
  return <Theme><DemoSite /></Theme>
}

const container = document.getElementById("app")
const root = createRoot(container)

root.render(<Site />)
