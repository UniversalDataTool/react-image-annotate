// @flow

import React, { useRef, memo } from "react"
import Paper from "@material-ui/core/Paper"
import { makeStyles } from "@material-ui/core/styles"
import styles from "./styles"
import classnames from "classnames"
import type { Region } from "../ImageCanvas/region-tools.js"
import IconButton from "@material-ui/core/IconButton"
import Button from "@material-ui/core/Button"
import TrashIcon from "@material-ui/icons/Delete"
import CheckIcon from "@material-ui/icons/Check"
import TextField from "@material-ui/core/TextField"
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import { InputAdornment } from "@material-ui/core"
import { asMutable } from "seamless-immutable"
import SquareFootIcon from '@mui/icons-material/SquareFoot'
import DeviceList from "./DeviceList"

const useStyles = makeStyles(styles)

type Props = {
  region: Region,
  editing?: boolean,
  allowedClasses?: Array<string>,
  allowedTags?: Array<string>,
  cls?: string,
  tags?: Array<string>,
  onDelete: (Region) => null,
  onChange: (Region) => null,
  onClose: (Region) => null,
  onOpen: (Region) => null,
  onRegionClassAdded: () => {},
  allowComments?: boolean,
}

const all_types = [...new Set(DeviceList.map(pair => pair.category))];
const all_symbols = [...new Set(DeviceList.map(pair => pair.symbol_name))]
const allowed_conduit_type = ["FEEDERS", "CABLE", "TRAY", "WIREMOLD", "CONDUIT AND WIRE"];
const allowed_device_type = all_types.filter(x => !allowed_conduit_type.includes(x));
const conduit_symbols = DeviceList.filter(i => allowed_conduit_type.includes(i.category)).map(symbol => symbol.symbol_name);
const device_symbols = DeviceList.filter(i => allowed_device_type.includes(i.category)).map(symbol => symbol.symbol_name);

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
  allowComments,
}: Props) => {
  const classes = useStyles()
  const commentInputRef = useRef(null)
  const onCommentInputClick = (_) => {
    // The TextField wraps the <input> tag with two divs
    const commentInput = commentInputRef.current.children[0].children[0]

    if (commentInput) return commentInput.focus()
  }

  const conditionalRegionTextField = (regionType) => {
    if (regionType === "scale") {
      // do scale
      return (
        <TextField
          inputProps={{ style: { textAlign: 'right' } }}
          InputProps={{
            className: classes.textfieldClass,
            endAdornment: <InputAdornment position="end"> ft</InputAdornment>
          }}
          width="50%"
          type="number"
          ref={commentInputRef}
          onClick={onCommentInputClick}
          value={region.cls || ""}
          onChange={(event) =>
            onChange({ ...(region: any), cls: event.target.value })
          }
        />
      )
    }
    else if (regionType === "line") {
      // do line
      return (
        <CreatableSelect
          placeholder="Conduit"
          onChange={(o, actionMeta) => {
            if (actionMeta.action === "create-option") {
              onRegionClassAdded(o.value)
            }
            return onChange({
              ...(region: any),
              cls: o.value,
            })
          }}
          value={
            region.cls ? { label: region.cls, value: region.cls } : null
          }
          options={asMutable(
            allowedClasses.filter(x => !all_symbols.includes(x)).concat(conduit_symbols).map((c) => ({ value: c, label: c }))

          )}
        />
      )
    } else {
      // do device
      return (
        <CreatableSelect
          placeholder="Device"
          onChange={(o, actionMeta) => {
            if (actionMeta.action === "create-option") {
              onRegionClassAdded(o.value)
            }
            return onChange({
              ...(region: any),
              cls: o.value,
            })
          }}
          value={
            region.cls ? { label: region.cls, value: region.cls } : null
          }
          options={asMutable(
            allowedClasses.filter(x => !all_symbols.includes(x)).concat(device_symbols).map((c) => ({ value: c, label: c }))
          )}
        />
      )
    }
  }

  return (
    <Paper
      onClick={() => (!editing ? onOpen(region) : null)}
      className={classnames(classes.regionInfo, {
        highlighted: region.highlighted,
      })}
    >
      {!editing ? (
        <div>
          {region.cls && (
            <div className="name">
              {region.type === "scale" ?
                <SquareFootIcon style={{ color: region.color }}/>
                : <div
                  className="circle"
                  style={{ backgroundColor: region.color }}
                />}

              {region.type === "scale" ?
                <div>{region.cls} ft</div> :
                <div>{region.cls}</div>}
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
        </div>
      ) : (
        <div style={{ width: 200 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
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
              {conditionalRegionTextField(region.type)}
            </div>
          )}
          {(allowedTags || []).length > 0 && (
            <div style={{ marginTop: 4 }}>
              <Select
                onChange={(newTags) =>
                  onChange({
                    ...(region: any),
                    tags: newTags.map((t) => t.value),
                  })
                }
                placeholder="Tags"
                value={(region.tags || []).map((c) => ({ label: c, value: c }))}
                isMulti
                options={asMutable(
                  allowedTags.map((c) => ({ value: c, label: c }))
                )}
              />
            </div>
          )}
          {allowComments && (
            <TextField
              InputProps={{
                className: classes.commentBox,
              }}
              fullWidth
              multiline
              rows={3}
              ref={commentInputRef}
              onClick={onCommentInputClick}
              value={region.comment || ""}
              onChange={(event) =>
                onChange({ ...(region: any), comment: event.target.value })
              }
            />
          )}
          {onClose && (
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
          )}
        </div>
      )}
    </Paper>
  )
}

export default memo(
  RegionLabel,
  (prevProps, nextProps) =>
    prevProps.editing === nextProps.editing &&
    prevProps.region === nextProps.region
)
