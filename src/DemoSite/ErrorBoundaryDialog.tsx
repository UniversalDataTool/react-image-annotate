// @flow

import { Component, ErrorInfo, ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

interface ErrorBoundaryDialogProps {
  children: ReactNode;
  onClose: () => void;
}

export default class ErrorBoundaryDialog extends Component<ErrorBoundaryDialogProps> {
  state = { hasError: false, err: "" };

  componentDidCatch(err: Error, info: ErrorInfo) {
    this.setState({
      hasError: true,
      err: err.toString() + "\n\n" + info.componentStack,
    });
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
      );
    }
    return this.props.children;
  }
}
