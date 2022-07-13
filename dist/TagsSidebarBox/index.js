import React, { useMemo, memo } from "react";
import SidebarBoxContainer from "../SidebarBoxContainer";
import StyleIcon from "@mui/icons-material/Style";
import { grey } from "@mui/material/colors";
import Select from "react-select";
import useEventCallback from "use-event-callback";
import { asMutable } from "seamless-immutable";
var emptyArr = [];

var noop = function noop() {
  return null;
};

export var TagsSidebarBox = function TagsSidebarBox(_ref) {
  var currentImage = _ref.currentImage,
      _ref$imageClsList = _ref.imageClsList,
      imageClsList = _ref$imageClsList === void 0 ? emptyArr : _ref$imageClsList,
      _ref$imageTagList = _ref.imageTagList,
      imageTagList = _ref$imageTagList === void 0 ? emptyArr : _ref$imageTagList,
      _ref$onChangeImage = _ref.onChangeImage,
      onChangeImage = _ref$onChangeImage === void 0 ? noop : _ref$onChangeImage;

  var _ref2 = currentImage || {},
      _ref2$tags = _ref2.tags,
      tags = _ref2$tags === void 0 ? [] : _ref2$tags,
      _ref2$cls = _ref2.cls,
      cls = _ref2$cls === void 0 ? null : _ref2$cls;

  var onChangeClassification = useEventCallback(function (o) {
    return onChangeImage({
      cls: o.value
    });
  });
  var onChangeTags = useEventCallback(function (o) {
    return onChangeImage({
      tags: o.map(function (a) {
        return a.value;
      })
    });
  });
  var selectValue = useMemo(function () {
    return cls ? {
      value: cls,
      label: cls
    } : null;
  }, [cls]);
  var memoImgClsList = useMemo(function () {
    return asMutable(imageClsList.map(function (c) {
      return {
        value: c,
        label: c
      };
    }));
  }, [imageClsList]);
  var memoImgTagList = useMemo(function () {
    return asMutable(imageTagList.map(function (c) {
      return {
        value: c,
        label: c
      };
    }));
  }, [imageTagList]);
  var memoCurrentTags = useMemo(function () {
    return tags.map(function (r) {
      return {
        value: r,
        label: r
      };
    });
  }, [tags]);
  if (!currentImage) return null;
  return React.createElement(SidebarBoxContainer, {
    title: "Image Tags",
    expandedByDefault: true,
    noScroll: true,
    icon: React.createElement(StyleIcon, {
      style: {
        color: grey[700]
      }
    })
  }, imageClsList.length > 0 && React.createElement("div", {
    style: {
      padding: 8
    }
  }, React.createElement(Select, {
    placeholder: "Image Classification",
    onChange: onChangeClassification,
    value: selectValue,
    options: memoImgClsList
  })), imageTagList.length > 0 && React.createElement("div", {
    style: {
      padding: 8,
      paddingTop: 0
    }
  }, React.createElement(Select, {
    isMulti: true,
    placeholder: "Image Tags",
    onChange: onChangeTags,
    value: memoCurrentTags,
    options: memoImgTagList
  })));
};
export default memo(TagsSidebarBox, function (prevProps, nextProps) {
  return prevProps.currentImage.cls === nextProps.currentImage.cls && prevProps.currentImage.tags === nextProps.currentImage.tags && prevProps.imageClsList === nextProps.imageClsList && prevProps.imageTagList === nextProps.imageTagList;
});