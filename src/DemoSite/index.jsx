// @flow
import React, {useState} from "react"
import Editor, {examples} from "./Editor"
import Annotator from "../Annotator"
import ErrorBoundaryDialog from "./ErrorBoundaryDialog.jsx"

export default () => {
  const [annotatorOpen, changeAnnotatorOpen] = useState(false)
  const [annotatorProps, changeAnnotatorProps] = useState(examples["Custom"]())
  const [lastOutput, changeLastOutput] = useState()

  return (
    <div style={{ height: "100%" }}>
      {annotatorOpen ? (
        <ErrorBoundaryDialog
          onClose={() => {
            changeAnnotatorOpen(false)
          }}
        >
          <Annotator
            {...(annotatorProps)}
            onExit={(output) => {
              delete (output)["lastAction"]
              changeLastOutput(output)
              changeAnnotatorOpen(false)
            }}
          />
        </ErrorBoundaryDialog>
      ) : (
        <Editor
          lastOutput={lastOutput}
          onOpenAnnotator={(props) => {
            changeAnnotatorProps(props)
            changeAnnotatorOpen(true)
          }}
        />
      )}
    </div>
  )
}
