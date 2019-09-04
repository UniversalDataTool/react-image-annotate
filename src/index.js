// @flow

import React from "react"
import Annotator from "./Annotator"
import Theme from "./Theme"

export default (props: any) => {
  return (
    <Theme>
      <Annotator {...props} />
    </Theme>
  )
}
