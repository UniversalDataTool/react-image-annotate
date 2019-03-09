// @flow
import React, { useState } from "react"
import Editor from "./Editor"
import Annotator from "../Annotator"

export default () => {
  const [annotatorOpen, changeAnnotatorOpen] = useState(false)
  const [annotatorProps, changeAnnotatorProps] = useState({})
  const [lastOutput, changeLastOutput] = useState()

  return (
    <div>
      {annotatorOpen ? (
        <Annotator
          {...(annotatorProps: any)}
          onExit={output => {
            delete (output: any)["lastAction"]
            changeLastOutput(output)
            changeAnnotatorOpen(false)
          }}
        />
      ) : (
        <Editor
          lastOutput={lastOutput}
          onOpenAnnotator={props => {
            changeAnnotatorProps(props)
            changeAnnotatorOpen(true)
          }}
        />
      )}
    </div>
  )
}
