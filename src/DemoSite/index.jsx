import {examples} from "./Examples.jsx"
import Annotator from "../Annotator"

export default () => {
  const annotatorProps = examples["Constrained Tools"]();

  return (
    <Annotator
      {...(annotatorProps)}
      onExit={(output) => {
        delete (output)["lastAction"]
        changeLastOutput(output)
        changeAnnotatorOpen(false)
      }}
    />
  )
}
