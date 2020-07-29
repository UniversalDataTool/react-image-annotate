// @flow

import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowsAlt,
  faMousePointer,
  faExpandArrowsAlt,
  faGripLines,
  faTag,
  faPaintBrush,
  faCrosshairs,
  faDrawPolygon,
  faVectorSquare,
  faHandPaper,
  faSearch,
  faMask,
} from "@fortawesome/free-solid-svg-icons"

export const iconDictionary = {
  select: () => <FontAwesomeIcon size="xs" fixedWidth icon={faMousePointer} />,
  pan: () => <FontAwesomeIcon size="xs" fixedWidth icon={faHandPaper} />,
  zoom: () => <FontAwesomeIcon size="xs" fixedWidth icon={faSearch} />,
  "show-tags": () => <FontAwesomeIcon size="xs" fixedWidth icon={faTag} />,
  "create-point": () => (
    <FontAwesomeIcon size="xs" fixedWidth icon={faCrosshairs} />
  ),
  "create-box": () => (
    <FontAwesomeIcon size="xs" fixedWidth icon={faVectorSquare} />
  ),
  "create-polygon": () => (
    <FontAwesomeIcon size="xs" fixedWidth icon={faDrawPolygon} />
  ),
  "create-expanding-line": () => (
    <FontAwesomeIcon size="xs" fixedWidth icon={faGripLines} />
  ),
  "show-mask": () => <FontAwesomeIcon size="xs" fixedWidth icon={faMask} />,
}

export default iconDictionary
