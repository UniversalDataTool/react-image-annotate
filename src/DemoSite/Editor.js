// @flow

import React, { useState } from "react"
import Button from "@material-ui/core/Button"
import { makeStyles } from "@material-ui/core/styles"
import Select from "react-select"
import Code from "react-syntax-highlighter"
import Dialog from "@material-ui/core/Dialog"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"
import MonacoEditor from "react-monaco-editor"

const useStyles = makeStyles({
  editBar: {
    padding: 10,
    borderBottom: "1px solid #ccc",
    backgroundColor: "#f8f8f8",
    display: "flex",
    alignItems: "center",
    "& .button": { margin: 5 }
  },
  select: { width: 240, fontSize: 14 },
  contentArea: {
    padding: 10
  },
  specificationArea: {
    padding: 10
  }
})

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("customInput") || "{}")
  } catch (e) {
    return {}
  }
}

export const examples = {
  "Simple Bounding Box": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    // regionTagList: [],
    // regionClsList: ["hotdog"],
    regionTagList: ["has-bun"],
    regionClsList: ["hotdog", "not-hotdog"],
    enabledTools: ["select", "create-box"],
    // showTags: true,
    images: [
      {
        src:
          "https://images.unsplash.com/photo-1496905583330-eb54c7e5915a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        name: "hot-dogs-1"
      }
    ]
  }),
  "Simple Segmentation": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    regionClsList: ["car", "truck"],
    enabledTools: ["select", "create-polygon"],
    images: [
      {
        src:
          "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        name: "car-image-1"
      }
    ]
  }),
  Custom: () => loadSavedInput()
}

const Editor = ({ onOpenAnnotator, lastOutput }: any) => {
  const c = useStyles()
  const [currentError, changeCurrentError] = useState()
  const [selectedExample, changeSelectedExample] = useState(
    window.localStorage.getItem("customInput")
      ? "Custom"
      : "Simple Bounding Box"
  )
  const [outputDialogOpen, changeOutputOpen] = useState(false)
  const [currentJSONValue, changeCurrentJSONValue] = useState(
    JSON.stringify(examples[selectedExample](), null, "  ")
  )
  return (
    <div>
      <div className={c.editBar}>
        <h3>React Image Annotate</h3>
        <div style={{ flexGrow: 1 }} />
        <div>
          <div style={{ display: "inline-flex" }}>
            <Select
              className={c.select}
              value={{ label: selectedExample, value: selectedExample }}
              options={Object.keys(examples).map(s => ({
                label: s,
                value: s
              }))}
              onChange={selectedOption => {
                changeSelectedExample(selectedOption.value)

                changeCurrentJSONValue(
                  JSON.stringify(
                    selectedOption.value === "Custom"
                      ? loadSavedInput()
                      : examples[selectedOption.value](),
                    null,
                    "  "
                  )
                )
              }}
            />
          </div>
          <Button
            className="button"
            disabled={!lastOutput}
            onClick={() => changeOutputOpen(true)}
          >
            View Output
          </Button>
          <Button
            className="button"
            variant="outlined"
            disabled={Boolean(currentError)}
            onClick={() =>{
                onOpenAnnotator(
                  selectedExample === "Custom"
                    ? loadSavedInput()
                    : examples[selectedExample]
                )
              }
            }
          >
            Open Annotator
          </Button>
        </div>
      </div>
      <div
        className={c.contentArea}
        style={
          currentError
            ? { border: "2px solid #f00" }
            : { border: "2px solid #fff" }
        }
      >
        <div>
          <MonacoEditor
            value={currentJSONValue}
            language="javascript"
            onChange={code => {
              try {
                window.localStorage.setItem(
                  "customInput",
                  JSON.stringify(JSON.parse(code))
                )
                changeCurrentError(null)
              } catch (e) {
                changeCurrentError(e.toString())
              }
              changeCurrentJSONValue(code)
            }}
            width="100%"
            height="550px"
          />
        </div>
      </div>
      <div className={c.specificationArea}>
        <h2>React Image Annotate Format</h2>
        <Code language="javascript">{`
{
  taskDescription?: string, // markdown
  regionTagList?: Array<string>,
  regionClsList?: Array<string>,
  imageTagList?: Array<string>,
  imageClsList?: Array<string>,
  // all tools are enabled by default
  enabledTools?: Array< "select" | "create-point" | "create-box" | "create-polygon">,
  selectedImage?: string, // initial selected image
  images: Array<{
    src: string,
    thumbnailSrc?: string, // use this if you are using high-res images
    name: string,
    regions?: Array<{
      id: string | number,
      cls?: string,
      color?: string,
      tags?: Array<string>,

      // Point
      type: "point",
      x: number, // [0-1] % of image width
      y: number, // [0-1] % of image height

      // Bounding Box
      type: "box",
      x: number, // [0-1] % of image width
      y: number, // [0-1] % of image height
      w: number, // [0-1] % of image width
      h: number, // [0-1] % of image height

      // Polygon
      type: "polygon",
      open?: boolean, // should last and first points be connected, default: true
      points: Array<[number, number]> // [0-1] % of image width/height
    }>
  }>,
}
`}</Code>
      </div>
      <Dialog fullScreen open={outputDialogOpen}>
        <DialogTitle>React Image Annotate Output</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <MonacoEditor
            value={JSON.stringify(lastOutput, null, "  ")}
            language="javascript"
            width="100%"
            height="550px"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => changeOutputOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Editor
