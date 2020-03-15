// @flow

import React, { createContext } from "react"
import Button from "@material-ui/core/Button"

export const HeaderButtonContext = createContext()

export const HeaderButton = ({ name, Icon }: { name: string, Icon: any }) => {
  return (
    <HeaderButtonContext.Consumer>
      {({ onHeaderButtonClick }: any) => (
        <Button
          onClick={() => onHeaderButtonClick(name)}
          style={{ width: 80, margin: 2 }}
        >
          <div>
            <Icon style={{}} />
            <div style={{ fontWeight: "bold" }}>{name}</div>
          </div>
        </Button>
      )}
    </HeaderButtonContext.Consumer>
  )
}

export default HeaderButton
