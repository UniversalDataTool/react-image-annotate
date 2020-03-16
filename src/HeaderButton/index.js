// @flow

import React, { memo, createContext, useContext } from "react"
import { styled } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import useEventCallback from "use-event-callback"

const StyledButton = styled(Button)({
  width: 80,
  margin: 2
})

const IconName = styled("div")({
  fontWeight: "bold"
})

export const HeaderButtonContext = createContext()

const MemoizedHeaderButton = memo(
  ({ name, Icon, onClick }) => (
    <StyledButton onClick={onClick}>
      <div>
        <Icon />
        <IconName>{name}</IconName>
      </div>
    </StyledButton>
  ),
  (prevProps, nextProps) => prevProps.name === nextProps.name
)

export const HeaderButton = ({ name, Icon }: { name: string, Icon: any }) => {
  const { onHeaderButtonClick } = useContext(HeaderButtonContext)
  const onClick = useEventCallback(() => onHeaderButtonClick(name))
  return <MemoizedHeaderButton name={name} Icon={Icon} onClick={onClick} />
}

export default HeaderButton
