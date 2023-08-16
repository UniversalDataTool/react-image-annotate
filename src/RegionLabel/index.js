// @flow

import React, { useRef, memo, useEffect } from "react"
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
import LinearScaleIcon from "@material-ui/icons/LinearScale"
import DeviceList from "./DeviceList"
import ImageSearchIcon from "@material-ui/icons/ImageSearch"

const useStyles = makeStyles(styles)

type Props = {
  region: Region,
  editing?: boolean,
  allowedClasses?: Array<string>,
  allowedTags?: Array<string>,
  cls?: string,
  tags?: Array<string>,
  imageSrc?: string,
  pageIndex: number,
  regionTemplateMatchingDisabled?: boolean,
  onDelete: (Region) => null,
  onChange: (Region) => null,
  onClose: (Region) => null,
  onOpen: (Region) => null,
  onMatchTemplate: (Region) => null,
  finishMatchTemplate: (Region, PageProperties) => null,
  onRegionClassAdded: (cls) => any,
  allowComments?: boolean,
}

const all_types = [...new Set(DeviceList.map((pair) => pair.category))]
const all_symbols = [...new Set(DeviceList.map((pair) => pair.symbol_name))]
const allowed_conduit_type = [
  "FEEDERS",
  "CABLE",
  "TRAY",
  "WIREMOLD",
  "CONDUIT AND WIRE",
]
const allowed_device_type = all_types.filter(
  (x) => !allowed_conduit_type.includes(x)
)
const conduit_symbols = DeviceList.filter((i) =>
  allowed_conduit_type.includes(i.category)
).map((symbol) => symbol.symbol_name)
const device_symbols = DeviceList.filter((i) =>
  allowed_device_type.includes(i.category)
).map((symbol) => symbol.symbol_name)
const getRandomId = () => Math.random().toString().split(".")[1]

const encodeAzureURL = (url) => {
  var first = url.substring(0, url.lastIndexOf("/"))
  var parts = url.split("/")
  var part = parts[parts.length - 1]
  return first + "/" + encodeURIComponent(part)
}

export const RegionLabel = ({
  region,
  editing,
  allowedClasses,
  allowedTags,
  imageSrc,
  pageIndex,
  regionTemplateMatchingDisabled,
  onDelete,
  onChange,
  onClose,
  onOpen,
  onMatchTemplate,
  finishMatchTemplate,
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
  const [isTemplateMatchingLoading, setIsTemplateMatchingLoading] =
    React.useState(regionTemplateMatchingDisabled)
  const conditionalRegionTextField = (regionType) => {
    if (regionType === "scale") {
      // do scale
      return (
        <TextField
          inputProps={{ style: { textAlign: "right" } }}
          InputProps={{
            className: classes.textfieldClass,
            endAdornment: <InputAdornment position="end"> ft</InputAdornment>,
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
    } else if (regionType === "line") {
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
          value={region.cls ? { label: region.cls, value: region.cls } : null}
          options={asMutable(
            allowedClasses
              .filter((x) => !all_symbols.includes(x))
              .concat(conduit_symbols)
              .map((c) => ({ value: c, label: c }))
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
          value={region.cls ? { label: region.cls, value: region.cls } : null}
          options={asMutable(
            allowedClasses
              .filter((x) => !all_symbols.includes(x))
              .concat(device_symbols)
              .map((c) => ({ value: c, label: c }))
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
              {region.type === "scale" ? (
                <LinearScaleIcon style={{ color: region.color }} />
              ) : (
                <div
                  className="circle"
                  style={{ backgroundColor: region.color }}
                />
              )}

              {region.type === "scale" ? (
                <div>{region.cls} ft</div>
              ) : (
                <div>{region.cls}</div>
              )}
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
            {region.type === "box" ? (
              <IconButton
                disabled={isTemplateMatchingLoading}
                onClick={() => {
                  setIsTemplateMatchingLoading(true)
                  // TODO: get user_id, doc_id, page_id, threshold from the parent component above annotator
                  let page_properties = {
                    user_id: 80808080,
                    doc_id: 80808080,
                    page_id: 80808080,
                    threshold: 0.7,
                    page_index: pageIndex,
                  }
                  const region_coords = {
                    x: region.x,
                    y: region.y,
                    w: region.w,
                    h: region.h,
                  }
                  const region_color = region.color
                  const endpoint =
                    "https://6lufq8mux5.execute-api.us-east-2.amazonaws.com/default/xkey-lambda-ocr-arbiter"
                  const json_data = {
                    image_url: imageSrc,
                    page_index: page_properties["page_index"],
                    template_symbol_name: region.cls,
                    threshold: page_properties["threshold"],
                    user_id: page_properties["user_id"],
                    doc_id: page_properties["doc_id"],
                    page_id: page_properties["page_id"],
                    template_coord: region_coords,
                  }
                  onMatchTemplate(region)
                  fetch(endpoint, {
                    method: "POST", // or 'PUT'
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ queryStringParameters: json_data }),
                  })
                    .then((response) => {
                      if (response.ok) {
                        return response.json()
                      }
                      throw new Error("Backend Error")
                    })
                    .then((data) => {
                      // result can be empty
                      return data.body ? data.body.result : []
                    })
                    .then((res) => {
                      let results = res.map((r) => {
                        const new_region = {}
                        new_region["isOCR"] = true
                        new_region["x"] = r["x"]
                        new_region["y"] = r["y"]
                        new_region["w"] = r["w"]
                        new_region["h"] = r["h"]
                        new_region["editingLabels"] = false
                        new_region["highlighted"] = false
                        new_region["id"] = getRandomId()
                        new_region["cls"] = region.cls
                        new_region["type"] = "box"
                        new_region["color"] = region.color
                        new_region["visible"] = true
                        new_region["category"] =
                          region?.category ||
                          DeviceList.find((x) => x.symbol_name === region.cls)
                            ?.category ||
                          "NOT CLASSIFIED"
                        return new_region
                      })
                      finishMatchTemplate(results, page_properties)
                      setIsTemplateMatchingLoading(false)
                    })
                    .catch((error) => {
                      console.error("Error:", error)
                      finishMatchTemplate([], page_properties)
                      setIsTemplateMatchingLoading(false)
                    })
                }}
                tabIndex={-1}
                style={{ width: 22, height: 22 }}
                size="small"
                variant="outlined"
              >
                <ImageSearchIcon
                  style={{ marginTop: -8, width: 16, height: 16 }}
                />
              </IconButton>
            ) : null}
            <IconButton
              onClick={() => {
                onDelete(region)
              }}
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
                onChange({ ...region, comment: event.target.value })
              }
            />
          )}
          {onClose && (
            <div style={{ marginTop: 4, display: "flex" }}>
              <div style={{ flexGrow: 1 }} />
              <Button
                onClick={() => onClose(region)} // TODO: check icon will disable OCR for this (highlighted) region
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
