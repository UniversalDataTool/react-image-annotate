import { grey } from "@mui/material/colors"

export default {
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    height: "100%",
    maxHeight: "100vh",
    backgroundColor: "#fff",
    overflow: "hidden",
    "&.fullscreen": {
      position: "absolute",
      zIndex: 99999,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  headerTitle: {
    fontWeight: "bold",
    color: grey[700],
    paddingLeft: 16,
  },
}
