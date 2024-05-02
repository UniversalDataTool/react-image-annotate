// @flow

import Annotator, { AnnotatorProps } from "../Annotator";

export default (props: AnnotatorProps) => {
  return <Annotator {...props} fullImageSegmentationMode={true} />;
};
