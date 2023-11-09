import { grey } from "@material-ui/core/colors"

export default {
  canvas: { width: "100%", height: "100%", position: "relative", zIndex: 1 },
  zoomIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#191414",
    color: "#fff",
    opacity: 0.5,
    fontWeight: "bolder",
    fontSize: 14,
    padding: 4,
  },
  resetButton: {
    position: "absolute",
    bottom: 30,
    left: 0,
    backgroundColor: "#191414",
    color: "#fff",
    opacity: 0.8,
    fontWeight: "bolder",
    fontSize: 14,
    padding: 4,
    zIndex: 10,
  },
  fixedRegionLabel: {
    position: "absolute",
    zIndex: 10,
    top: 10,
    left: 10,
    opacity: 0.5,
    transition: "opacity 500ms",
    "&:hover": {
      opacity: 1,
    },
  },
}
