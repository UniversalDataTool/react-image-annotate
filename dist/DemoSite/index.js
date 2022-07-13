import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import Editor, { examples } from "./Editor";
import Annotator from "../Annotator";
import ErrorBoundaryDialog from "./ErrorBoundaryDialog.js";
export default (function () {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      annotatorOpen = _useState2[0],
      changeAnnotatorOpen = _useState2[1];

  var _useState3 = useState(examples["Custom"]()),
      _useState4 = _slicedToArray(_useState3, 2),
      annotatorProps = _useState4[0],
      changeAnnotatorProps = _useState4[1];

  var _useState5 = useState(),
      _useState6 = _slicedToArray(_useState5, 2),
      lastOutput = _useState6[0],
      changeLastOutput = _useState6[1];

  return React.createElement("div", null, annotatorOpen ? React.createElement(ErrorBoundaryDialog, {
    onClose: function onClose() {
      changeAnnotatorOpen(false);
    }
  }, React.createElement(Annotator, Object.assign({}, annotatorProps, {
    onExit: function onExit(output) {
      delete output["lastAction"];
      changeLastOutput(output);
      changeAnnotatorOpen(false);
    }
  }))) : React.createElement(Editor, {
    lastOutput: lastOutput,
    onOpenAnnotator: function onOpenAnnotator(props) {
      changeAnnotatorProps(props);
      changeAnnotatorOpen(true);
    }
  }));
});