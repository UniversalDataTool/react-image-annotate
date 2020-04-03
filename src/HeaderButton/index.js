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
  ({ name, disabled, Icon, onClick }) => (
    <StyledButton disabled={disabled} onClick={onClick}>
      <div>
        <Icon />
        <IconName>{name}</IconName>
      </div>
    </StyledButton>
  ),
  (prevProps, nextProps) =>
    prevProps.name === nextProps.name &&
    prevProps.disabled === nextProps.disabled
)

export const HeaderButton = ({
  name,
  disabled,
  Icon
}: {
  name: string,
  disabled?: boolean,
  Icon: any
}) => {
  const { onHeaderButtonClick } = useContext(HeaderButtonContext)
  const onClick = useEventCallback(() => onHeaderButtonClick(name))
  return (
    <MemoizedHeaderButton
      name={name}
      disabled={disabled}
      Icon={Icon}
      onClick={onClick}
    />
  )
}

export default HeaderButton
