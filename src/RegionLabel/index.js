// @flow

import React, { useState, memo } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import styles from "./styles"
import classnames from "classnames"
import type { Region } from "../ImageCanvas/region-tools.js"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import TrashIcon from "@material-ui/icons/Delete"
import CheckIcon from "@material-ui/icons/Check"
import UndoIcon from "@material-ui/icons/Undo"
import Select from "react-select"
import { asMutable } from "seamless-immutable"

const useStyles = makeStyles(styles)

type Props = {
  region: Region,
  editing?: boolean,
  allowedClasses?: Array<string>,
  allowedTags?: Array<string>,
  cls?: string,
  tags?: Array<string>,
  onDelete: Region => null,
  onChange: Region => null,
  onClose: Region => null,
  onOpen: Region => null
}

export const RegionLabel = ({
  region,
  editing,
  allowedClasses,
  allowedTags,
  onDelete,
  onChange,
  onClose,
  onOpen
}: Props) => {
  const classes = useStyles()

  return (
    <Paper
      onKeyPress={e => {
        e.stopPropagation()
      }}
      onKeyDown={e => {
        e.stopPropagation()
      }}
      onKeyUp={e => {
        e.stopPropagation()
      }}
      onClick={() => (!editing ? onOpen(region) : null)}
      className={classnames(classes.regionInfo, {
        highlighted: region.highlighted
      })}
    >
      {!editing ? (
        <div>
          {region.cls && (
            <div className="name">
              <div
                className="circle"
                style={{ backgroundColor: region.color }}
              />
              {region.cls}
            </div>
          )}
          {region.tags && (
            <div className="tags">
              {region.tags.map(t => (
                <div key={t} className="tag">
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ width: 200 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              style={{
                display: "flex",
                backgroundColor: region.color,
                color: "#fff",
                padding: 4,
                paddingLeft: 8,
                paddingRight: 8,
                borderRadius: 4,
                fontWeight: "bold",
                textShadow: "0px 0px 5px rgba(0,0,0,0.4)"
              }}
            >
              {region.type}
            </div>
            <div style={{ flexGrow: 1 }} />
            <IconButton
              onClick={() => onDelete(region)}
              tabIndex={-1}
              style={{ width: 22, height: 22 }}
              size="small"
              variant="outlined"
            >
              <TrashIcon style={{ marginTop: -8, width: 16, height: 16 }} />
            </IconButton>
          </div>
          {(allowedClasses || []).length > 0 && (
            <div style={{ marginTop: 6 }}>
              <Select
                placeholder="Classification"
                onChange={o =>
                  onChange({
                    ...(region: any),
                    cls: o.value
                  })
                }
                value={
                  region.cls ? { label: region.cls, value: region.cls } : null
                }
                options={asMutable(
                  allowedClasses.map(c => ({ value: c, label: c }))
                )}
              />
            </div>
          )}
          {(allowedTags || []).length > 0 && (
            <div style={{ marginTop: 4 }}>
              <Select
                onChange={newTags =>
                  onChange({
                    ...(region: any),
                    tags: newTags.map(t => t.value)
                  })
                }
                placeholder="Tags"
                value={(region.tags || []).map(c => ({ label: c, value: c }))}
                isMulti
                options={asMutable(
                  allowedTags.map(c => ({ value: c, label: c }))
                )}
              />
            </div>
          )}
          <div style={{ marginTop: 4, display: "flex" }}>
            <div style={{ flexGrow: 1 }} />
            <Button
              onClick={() => onClose(region)}
              size="small"
              variant="contained"
              color="primary"
            >
              <CheckIcon />
            </Button>
          </div>
        </div>
      )}
    </Paper>
  )
}

export default memo(
  RegionLabel,
  (prevProps, nextProps) =>
    prevProps.editing === nextProps.editing &&
    prevProps.region.x === nextProps.region.x &&
    prevProps.region.y === nextProps.region.y &&
    prevProps.region.tags === nextProps.region.tags &&
    prevProps.region.cls === nextProps.region.cls &&
    prevProps.region.color === nextProps.region.color &&
    prevProps.region.highlighted === nextProps.region.highlighted
)
