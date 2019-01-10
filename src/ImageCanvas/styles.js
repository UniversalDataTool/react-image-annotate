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
  regionInfo: {
    position: "absolute",
    fontSize: 12,
    cursor: "default",
    transition: "opacity 200ms",
    opacity: 0.7,
    "&:hover": {
      opacity: 0.9,
      cursor: "pointer"
    },
    "&.highlighted": {
      opacity: 0.9,
      "&:hover": {
        opacity: 1
      }
    },
    // pointerEvents: "none",
    fontWeight: 600,
    color: grey[900],
    padding: 8,
    "& .name": {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "& .circle": {
        marginRight: 4,
        boxShadow: "0px 0px 2px rgba(0,0,0,0.4)",
        width: 10,
        height: 10,
        borderRadius: 5
      }
    },
    "& .tags": {
      "& .tag": {
        color: grey[700],
        display: "inline-block",
        margin: 1,
        fontSize: 10,
        textDecoration: "underline"
      }
    }
  },
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
