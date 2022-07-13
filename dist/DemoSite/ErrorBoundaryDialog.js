import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import React, { Component } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

var ErrorBoundaryDialog =
/*#__PURE__*/
function (_Component) {
  _inherits(ErrorBoundaryDialog, _Component);

  function ErrorBoundaryDialog() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ErrorBoundaryDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ErrorBoundaryDialog)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.state = {
      hasError: false,
      err: ""
    };
    return _this;
  }

  _createClass(ErrorBoundaryDialog, [{
    key: "componentDidCatch",
    value: function componentDidCatch(err, info) {
      this.setState({
        hasError: true,
        err: err.toString() + "\n\n" + info.componentStack
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.hasError) {
        return React.createElement(Dialog, {
          open: this.state.hasError,
          onClose: this.props.onClose
        }, React.createElement(DialogTitle, null, "Error Loading Annotator"), React.createElement(DialogContent, null, React.createElement("pre", null, this.state.err)), React.createElement(DialogActions, null, React.createElement(Button, {
          onClick: this.props.onClose
        }, "Close")));
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundaryDialog;
}(Component);

export { ErrorBoundaryDialog as default };