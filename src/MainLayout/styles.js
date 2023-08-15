import { grey } from "@material-ui/core/colors"

export default {
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    height: "100%",
    maxHeight: "100vh",
    backgroundColor: "#121212",
    overflow: "hidden",
    position: "absolute",
    zIndex: 99999,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
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
    color: '#fff',
    paddingLeft: 16,
  },
}
