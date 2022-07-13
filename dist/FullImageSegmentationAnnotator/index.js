import React from "react";
import Annotator from "../Annotator";
export default (function (props) {
  return React.createElement(Annotator, Object.assign({}, props, {
    fullImageSegmentationMode: true
  }));
});