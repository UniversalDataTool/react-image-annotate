// @flow

import React, {memo, useRef} from "react"
import Paper from "@mui/material/Paper"
import {createTheme, styled, ThemeProvider} from "@mui/material/styles"
import styles from "./styles"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button"
import TrashIcon from "@mui/icons-material/Delete"
import CheckIcon from "@mui/icons-material/Check"
import TextField from "@mui/material/TextField"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"

import {asMutable} from "seamless-immutable"

const theme = createTheme()
const StyledPaper = styled(Paper)(({ theme }) => styles.regionInfo)

export const RegionLabel = ({
  region,
  editing,
  allowedClasses,
  allowedTags,
  onDelete,
  onChange,
  onClose,
  onOpen,
  onRegionClassAdded,
  enabledProperties
}) => {
  const commentInputRef = useRef(null)
  const onCommentInputClick = (_) => {
    // The TextField wraps the <input> tag with two divs
    const commentInput = commentInputRef.current.children[0].children[0]

    if (commentInput) return commentInput.focus()
  }
  // I have no idea why the click is not working, so I copied the solution from above...
  const nameInputRef = useRef(null)
  const onNameInputClick = (_) => {
    const nameInput = nameInputRef.current.children[1].children[0]

    if (nameInput) return nameInput.focus()
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledPaper
        onClick={() => (!editing ? onOpen(region) : null)}
        className={region.highlighted ? "highlighted" : ""}
      >
        {!editing ? (
          <div>
            {region.cls && (
              <div className="name">
                <div
                  className="circle"
                  style={{backgroundColor: region.color}}
                />
                {region.cls}
              </div>
            )}
            {region.tags && (
              <div className="tags">
                {region.tags.map((t) => (
                  <div key={t} className="tag">
                    {t}
                  </div>
                ))}
              </div>
            )}
            {region.name && (
              <div className="tags">
                <div key="name" className="tag">
                  {region.name}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{width: 200}}>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div
                style={{
                  display: "flex",
                  backgroundColor: region.color || "#888",
                  color: "#fff",
                  padding: 4,
                  paddingLeft: 8,
                  paddingRight: 8,
                  borderRadius: 4,
                  fontWeight: "bold",
                  textShadow: "0px 0px 5px rgba(0,0,0,0.4)",
                }}
              >
                {region.type}
              </div>
              <div style={{flexGrow: 1}} />
              <IconButton
                onClick={() => onDelete(region)}
                tabIndex={-1}
                style={{width: 22, height: 22}}
                size="small"
                variant="outlined"
              >
                <TrashIcon style={{marginTop: -8, width: 16, height: 16}} />
              </IconButton>
            </div>
            {enabledProperties.includes("class") && (allowedClasses || []).length > 0 && (
              <div style={{marginTop: 6}}>
                <CreatableSelect
                  placeholder="Classification"
                  onChange={(o, actionMeta) => {
                    if (actionMeta.action === "create-option") {
                      onRegionClassAdded(o.value)
                    }
                    return onChange({
                      ...(region),
                      cls: o.value,
                    })
                  }}
                  value={
                    region.cls ? {label: region.cls, value: region.cls} : null
                  }
                  options={asMutable(
                    allowedClasses.map((c) => ({value: c, label: c}))
                  )}
                />
              </div>
            )}
            {enabledProperties.includes("tags") && (allowedTags || []).length > 0 && (
              <div style={{marginTop: 4}}>
                <Select
                  onChange={(newTags) =>
                    onChange({
                      ...(region),
                      tags: newTags.map((t) => t.value),
                    })
                  }
                  placeholder="Tags"
                  value={(region.tags || []).map((c) => ({
                    label: c,
                    value: c,
                  }))}
                  isMulti
                  options={asMutable(
                    allowedTags.map((c) => ({value: c, label: c}))
                  )}
                />
              </div>
            )}
            {enabledProperties.includes("comment") && (
              <TextField
                InputProps={{
                  sx: styles.commentBox,
                }}
                fullWidth
                multiline
                rows={3}
                ref={commentInputRef}
                onClick={onCommentInputClick}
                value={region.comment || ""}
                onChange={(event) =>
                  onChange({...(region), comment: event.target.value})
                }
              />
            )}
            {enabledProperties.includes("name") && (
              <TextField
                id="nameField"
                label="name"
                ref={nameInputRef}
                onClick={onNameInputClick}
                value={region.name || ""}
                onChange={(event) =>
                  onChange({...(region), name: event.target.value})
                }
              />
            )}
            {onClose && (
              <div style={{marginTop: 4, display: "flex"}}>
                <div style={{flexGrow: 1}} />
                <Button
                  onClick={() => onClose(region)}
                  size="small"
                  variant="contained"
                  color="primary"
                >
                  <CheckIcon />
                </Button>
              </div>
            )}
          </div>
        )}
      </StyledPaper>
    </ThemeProvider>
  )
}

export default memo(
  RegionLabel,
  (prevProps, nextProps) =>
    prevProps.editing === nextProps.editing &&
    prevProps.region === nextProps.region
)
