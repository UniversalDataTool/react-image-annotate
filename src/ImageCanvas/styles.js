import { grey } from "@material-ui/core/colors"

export default {
  "@keyframes borderDance": {
    from: { strokeDashoffset: 0 },
    to: { strokeDashoffset: 100 }
  },
  highlightBox: {
    transition: "opacity 500ms",
    "&:not(.highlighted)": {
      opacity: 0
    },
    "&:not(.highlighted):hover": {
      opacity: 0.6
    },
    "& path": {
      vectorEffect: "non-scaling-stroke",
      strokeWidth: 2,
      stroke: "#FFF",
      fill: "none",
      strokeDasharray: 5,
      animationName: "$borderDance",
      animationDuration: "4s",
      animationTimingFunction: "linear",
      animationIterationCount: "infinite",
      animationPlayState: "running"
    }
  },
  canvas: { width: "100%", height: "100%" },
  transformGrabber: {
    width: 8,
    height: 8,
    border: "2px solid #FFF",
    position: "absolute"
  },
  zoomIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    color: "#fff",
    opacity: 0.5,
    fontWeight: "bolder",
    fontSize: 14,
    padding: 4
  }
}
