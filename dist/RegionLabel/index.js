import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import React, { useRef, memo } from "react";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "./styles";
import classnames from "classnames";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TrashIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { asMutable } from "seamless-immutable";
var theme = createTheme();
var useStyles = makeStyles(function (theme) {
  return styles;
});
export var RegionLabel = function RegionLabel(_ref) {
  var region = _ref.region,
      editing = _ref.editing,
      allowedClasses = _ref.allowedClasses,
      allowedTags = _ref.allowedTags,
      onDelete = _ref.onDelete,
      _onChange = _ref.onChange,
      onClose = _ref.onClose,
      onOpen = _ref.onOpen,
      onRegionClassAdded = _ref.onRegionClassAdded,
      allowComments = _ref.allowComments;
  var classes = useStyles();
  var commentInputRef = useRef(null);

  var onCommentInputClick = function onCommentInputClick(_) {
    // The TextField wraps the <input> tag with two divs
    var commentInput = commentInputRef.current.children[0].children[0];
    if (commentInput) return commentInput.focus();
  };

  return React.createElement(ThemeProvider, {
    theme: theme
  }, React.createElement(Paper, {
    onClick: function onClick() {
      return !editing ? onOpen(region) : null;
    },
    className: classnames(classes.regionInfo, {
      highlighted: region.highlighted
    })
  }, !editing ? React.createElement("div", null, region.cls && React.createElement("div", {
    className: "name"
  }, React.createElement("div", {
    className: "circle",
    style: {
      backgroundColor: region.color
    }
  }), region.cls), region.tags && React.createElement("div", {
    className: "tags"
  }, region.tags.map(function (t) {
    return React.createElement("div", {
      key: t,
      className: "tag"
    }, t);
  }))) : React.createElement("div", {
    style: {
      width: 200
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row"
    }
  }, React.createElement("div", {
    style: {
      display: "flex",
      backgroundColor: region.color || "#888",
      color: "#fff",
      padding: 4,
      paddingLeft: 8,
      paddingRight: 8,
      borderRadius: 4,
      fontWeight: "bold",
      textShadow: "0px 0px 5px rgba(0,0,0,0.4)"
    }
  }, region.type), React.createElement("div", {
    style: {
      flexGrow: 1
    }
  }), React.createElement(IconButton, {
    onClick: function onClick() {
      return onDelete(region);
    },
    tabIndex: -1,
    style: {
      width: 22,
      height: 22
    },
    size: "small",
    variant: "outlined"
  }, React.createElement(TrashIcon, {
    style: {
      marginTop: -8,
      width: 16,
      height: 16
    }
  }))), (allowedClasses || []).length > 0 && React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, React.createElement(CreatableSelect, {
    placeholder: "Classification",
    onChange: function onChange(o, actionMeta) {
      if (actionMeta.action == "create-option") {
        onRegionClassAdded(o.value);
      }

      return _onChange(_objectSpread({}, region, {
        cls: o.value
      }));
    },
    value: region.cls ? {
      label: region.cls,
      value: region.cls
    } : null,
    options: asMutable(allowedClasses.map(function (c) {
      return {
        value: c,
        label: c
      };
    }))
  })), (allowedTags || []).length > 0 && React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, React.createElement(Select, {
    onChange: function onChange(newTags) {
      return _onChange(_objectSpread({}, region, {
        tags: newTags.map(function (t) {
          return t.value;
        })
      }));
    },
    placeholder: "Tags",
    value: (region.tags || []).map(function (c) {
      return {
        label: c,
        value: c
      };
    }),
    isMulti: true,
    options: asMutable(allowedTags.map(function (c) {
      return {
        value: c,
        label: c
      };
    }))
  })), allowComments && React.createElement(TextField, {
    InputProps: {
      className: classes.commentBox
    },
    fullWidth: true,
    multiline: true,
    rows: 3,
    ref: commentInputRef,
    onClick: onCommentInputClick,
    value: region.comment || "",
    onChange: function onChange(event) {
      return _onChange(_objectSpread({}, region, {
        comment: event.target.value
      }));
    }
  }), onClose && React.createElement("div", {
    style: {
      marginTop: 4,
      display: "flex"
    }
  }, React.createElement("div", {
    style: {
      flexGrow: 1
    }
  }), React.createElement(Button, {
    onClick: function onClick() {
      return onClose(region);
    },
    size: "small",
    variant: "contained",
    color: "primary"
  }, React.createElement(CheckIcon, null))))));
};
export default memo(RegionLabel, function (prevProps, nextProps) {
  return prevProps.editing === nextProps.editing && prevProps.region === nextProps.region;
});