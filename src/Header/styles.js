import { grey } from "@material-ui/core/colors"

export default {
  header: {
    display: "flex",
    position: "relative",
    flexDirection: "row",
    flexShrink: 0,
    zIndex: 10,
    boxShadow: "0px 3px 8px rgba(0,0,0,.1)"
  },
  fileInfo: {
    alignItems: "center",
    flexGrow: 1,
    "&.videoMode": {
      flexMode: 0.1
    },
    display: "flex",
    fontWeight: "bold",
    color: grey[800],
    marginRight: 16,
    fontSize: 24,
    paddingLeft: 16
  }
}
