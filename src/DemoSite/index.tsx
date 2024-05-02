// @flow
import { useState } from "react";
import Editor, { examples } from "./Editor";
import Annotator, { AnnotatorProps } from "../Annotator";
import ErrorBoundaryDialog from "./ErrorBoundaryDialog";
import { MainLayoutState } from "../MainLayout/types.ts";

export default () => {
  const [annotatorOpen, changeAnnotatorOpen] = useState(false);
  const [annotatorProps, changeAnnotatorProps] = useState<
    Omit<AnnotatorProps, "onExit">
  >(examples["FULL"]());
  const [lastOutput, changeLastOutput] = useState<MainLayoutState | null>(null);

  return (
    <div>
      {annotatorOpen ? (
        <ErrorBoundaryDialog
          onClose={() => {
            changeAnnotatorOpen(false);
          }}
        >
          <Annotator
            {...annotatorProps}
            onExit={(output) => {
              delete output["lastAction"];
              changeLastOutput(output);
              changeAnnotatorOpen(false);
            }}
          />
        </ErrorBoundaryDialog>
      ) : (
        <Editor
          lastOutput={lastOutput}
          onOpenAnnotator={(props: AnnotatorProps) => {
            changeAnnotatorProps(props);
            changeAnnotatorOpen(true);
          }}
        />
      )}
    </div>
  );
};
