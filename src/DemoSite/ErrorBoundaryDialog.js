// @flow

import React, { Component } from "react"
import Dialog from "@material-ui/core/Dialog"
import Button from "@material-ui/core/Button"
import DialogTitle from "@material-ui/core/DialogTitle"
import DialogContent from "@material-ui/core/DialogContent"
import DialogActions from "@material-ui/core/DialogActions"

export default class ErrorBoundaryDialog extends Component {
  state = { hasError: false, err: "" }
  componentDidCatch(err, info) {
    this.setState({
      hasError: true,
      err: err.toString() + "\n\n" + info.componentStack,
    })
  }
  render() {
    if (this.state.hasError) {
      return (
        <Dialog open={this.state.hasError} onClose={this.props.onClose}>
          <DialogTitle>Error Loading Annotator</DialogTitle>
          <DialogContent>
            <pre>{this.state.err}</pre>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )
    }
    return this.props.children
  }
}
