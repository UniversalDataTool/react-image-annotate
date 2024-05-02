// @flow

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCompress,
  faCrosshairs,
  faDrawPolygon,
  faEdit,
  faExpand,
  faGripLines,
  faHandPaper,
  faMask,
  faMousePointer,
  faSearch,
  faTag,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";

const faStyle = { marginTop: 4, width: 16, height: 16, marginBottom: 4 };

export const iconDictionary: Record<
  string,
  OverridableComponent<SvgIconTypeMap>
> = {
  select: () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faMousePointer}
    />
  ),
  pan: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faHandPaper} />
  ),
  zoom: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faSearch} />
  ),
  "show-tags": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faTag} />
  ),
  "create-point": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faCrosshairs} />
  ),
  "create-box": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faVectorSquare}
    />
  ),
  "create-polygon": () => (
    <FontAwesomeIcon
      style={faStyle}
      size="xs"
      fixedWidth
      icon={faDrawPolygon}
    />
  ),
  "create-expanding-line": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faGripLines} />
  ),
  "create-line": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faChartLine} />
  ),
  "show-mask": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faMask} />
  ),
  "modify-allowed-area": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faEdit} />
  ),
  "create-keypoints": () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faExpand} />
  ),
  fullscreen: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faExpand} />
  ),
  window: () => (
    <FontAwesomeIcon style={faStyle} size="xs" fixedWidth icon={faCompress} />
  ),
};

export default iconDictionary;
