// @flow

import React from "react"
import Button from "@material-ui/core/Button"

export default ({ name, Icon }: { name: string, Icon: any }) => {
  return (
    <Button style={{ width: 80, margin: 2 }}>
      <div>
        <Icon style={{}} />
        <div style={{ fontWeight: "bold" }}>{name}</div>
      </div>
    </Button>
  )
}
