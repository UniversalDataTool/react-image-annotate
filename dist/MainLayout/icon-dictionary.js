import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faMousePointer, faExpandArrowsAlt, faGripLines, faTag, faPaintBrush, faCrosshairs, faDrawPolygon, faVectorSquare, faHandPaper, faSearch, faMask, faEdit, faChartLine } from "@fortawesome/free-solid-svg-icons";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
var faStyle = {
  marginTop: 4,
  width: 16,
  height: 16,
  marginBottom: 4
};
export var iconDictionary = {
  select: function select() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faMousePointer
    });
  },
  pan: function pan() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faHandPaper
    });
  },
  zoom: function zoom() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faSearch
    });
  },
  "show-tags": function showTags() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faTag
    });
  },
  "create-point": function createPoint() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faCrosshairs
    });
  },
  "create-box": function createBox() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faVectorSquare
    });
  },
  "create-polygon": function createPolygon() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faDrawPolygon
    });
  },
  "create-expanding-line": function createExpandingLine() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faGripLines
    });
  },
  "create-line": function createLine() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faChartLine
    });
  },
  "show-mask": function showMask() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faMask
    });
  },
  "modify-allowed-area": function modifyAllowedArea() {
    return React.createElement(FontAwesomeIcon, {
      style: faStyle,
      size: "xs",
      fixedWidth: true,
      icon: faEdit
    });
  },
  "create-keypoints": AccessibilityNewIcon,
  window: FullscreenIcon
};
export default iconDictionary;