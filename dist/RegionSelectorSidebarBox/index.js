import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { Fragment, useState, memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import RegionIcon from "@mui/icons-material/PictureInPicture";
import Grid from "@mui/material/Grid";
import ReorderIcon from "@mui/icons-material/SwapVert";
import PieChartIcon from "@mui/icons-material/PieChart";
import TrashIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import UnlockIcon from "@mui/icons-material/LockOpen";
import VisibleIcon from "@mui/icons-material/Visibility";
import VisibleOffIcon from "@mui/icons-material/VisibilityOff";
import styles from "./styles";
import classnames from "classnames";
import isEqual from "lodash/isEqual";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return styles;
});
var HeaderSep = styled("div")(function (_ref) {
  var theme = _ref.theme;
  return {
    borderTop: "1px solid ".concat(grey[200]),
    marginTop: 2,
    marginBottom: 2
  };
});

var Chip = function Chip(_ref2) {
  var color = _ref2.color,
      text = _ref2.text;
  var classes = useStyles();
  return React.createElement("span", {
    className: classes.chip
  }, React.createElement("div", {
    className: "color",
    style: {
      backgroundColor: color
    }
  }), React.createElement("div", {
    className: "text"
  }, text));
};

var RowLayout = function RowLayout(_ref3) {
  var header = _ref3.header,
      highlighted = _ref3.highlighted,
      order = _ref3.order,
      classification = _ref3.classification,
      area = _ref3.area,
      tags = _ref3.tags,
      trash = _ref3.trash,
      lock = _ref3.lock,
      visible = _ref3.visible,
      onClick = _ref3.onClick;
  var classes = useStyles();

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      mouseOver = _useState2[0],
      changeMouseOver = _useState2[1];

  return React.createElement("div", {
    onClick: onClick,
    onMouseEnter: function onMouseEnter() {
      return changeMouseOver(true);
    },
    onMouseLeave: function onMouseLeave() {
      return changeMouseOver(false);
    },
    className: classnames(classes.row, {
      header: header,
      highlighted: highlighted
    })
  }, React.createElement(Grid, {
    container: true,
    alignItems: "center"
  }, React.createElement(Grid, {
    item: true,
    xs: 2
  }, React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 10
    }
  }, order)), React.createElement(Grid, {
    item: true,
    xs: 5
  }, classification), React.createElement(Grid, {
    item: true,
    xs: 2
  }, React.createElement("div", {
    style: {
      textAlign: "right",
      paddingRight: 6
    }
  }, area)), React.createElement(Grid, {
    item: true,
    xs: 1
  }, trash), React.createElement(Grid, {
    item: true,
    xs: 1
  }, lock), React.createElement(Grid, {
    item: true,
    xs: 1
  }, visible)));
};

var RowHeader = function RowHeader() {
  return React.createElement(RowLayout, {
    header: true,
    highlighted: false,
    order: React.createElement(ReorderIcon, {
      className: "icon"
    }),
    classification: React.createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, "Class"),
    area: React.createElement(PieChartIcon, {
      className: "icon"
    }),
    trash: React.createElement(TrashIcon, {
      className: "icon"
    }),
    lock: React.createElement(LockIcon, {
      className: "icon"
    }),
    visible: React.createElement(VisibleIcon, {
      className: "icon"
    })
  });
};

var MemoRowHeader = memo(RowHeader);

var Row = function Row(_ref4) {
  var r = _ref4.region,
      highlighted = _ref4.highlighted,
      onSelectRegion = _ref4.onSelectRegion,
      onDeleteRegion = _ref4.onDeleteRegion,
      onChangeRegion = _ref4.onChangeRegion,
      visible = _ref4.visible,
      locked = _ref4.locked,
      color = _ref4.color,
      cls = _ref4.cls,
      index = _ref4.index;
  return React.createElement(RowLayout, {
    header: false,
    highlighted: highlighted,
    onClick: function onClick() {
      return onSelectRegion(r);
    },
    order: "#".concat(index + 1),
    classification: React.createElement(Chip, {
      text: cls || "",
      color: color || "#ddd"
    }),
    area: "",
    trash: React.createElement(TrashIcon, {
      onClick: function onClick() {
        return onDeleteRegion(r);
      },
      className: "icon2"
    }),
    lock: r.locked ? React.createElement(LockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: false
        }));
      },
      className: "icon2"
    }) : React.createElement(UnlockIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          locked: true
        }));
      },
      className: "icon2"
    }),
    visible: r.visible || r.visible === undefined ? React.createElement(VisibleIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          visible: false
        }));
      },
      className: "icon2"
    }) : React.createElement(VisibleOffIcon, {
      onClick: function onClick() {
        return onChangeRegion(_objectSpread({}, r, {
          visible: true
        }));
      },
      className: "icon2"
    })
  });
};

var MemoRow = memo(Row, function (prevProps, nextProps) {
  return prevProps.highlighted === nextProps.highlighted && prevProps.visible === nextProps.visible && prevProps.locked === nextProps.locked && prevProps.id === nextProps.id && prevProps.index === nextProps.index && prevProps.cls === nextProps.cls && prevProps.color === nextProps.color;
});
var emptyArr = [];
export var RegionSelectorSidebarBox = function RegionSelectorSidebarBox(_ref5) {
  var _ref5$regions = _ref5.regions,
      regions = _ref5$regions === void 0 ? emptyArr : _ref5$regions,
      onDeleteRegion = _ref5.onDeleteRegion,
      onChangeRegion = _ref5.onChangeRegion,
      onSelectRegion = _ref5.onSelectRegion;
  var classes = useStyles();
  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(SidebarBoxContainer, {
    title: "Regions",
    subTitle: "",
    icon: React.createElement(RegionIcon, {
      style: {
        color: grey[700]
      }
    }),
    expandedByDefault: true
  }, React.createElement("div", {
    className: classes.container
  }, React.createElement(MemoRowHeader, null), React.createElement(HeaderSep, null), regions.map(function (r, i) {
    return React.createElement(MemoRow, Object.assign({
      key: r.id
    }, r, {
      region: r,
      index: i,
      onSelectRegion: onSelectRegion,
      onDeleteRegion: onDeleteRegion,
      onChangeRegion: onChangeRegion
    }));
  }))));
};

var mapUsedRegionProperties = function mapUsedRegionProperties(r) {
  return [r.id, r.color, r.locked, r.visible, r.highlighted];
};

export default memo(RegionSelectorSidebarBox, function (prevProps, nextProps) {
  return isEqual((prevProps.regions || emptyArr).map(mapUsedRegionProperties), (nextProps.regions || emptyArr).map(mapUsedRegionProperties));
});