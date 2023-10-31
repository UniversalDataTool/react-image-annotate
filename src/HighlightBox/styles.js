export default {
  "@keyframes borderDance": {
    from: {strokeDashoffset: 0},
    to: {strokeDashoffset: 100},
  },
  highlightBox: {
    zIndex: 2,
    transition: "opacity 500ms",
    "&.highlighted": {
      zIndex: 3,
    },
    "&:not(.highlighted)": {
      opacity: 0,
    },
    "&:not(.highlighted):hover": {
      opacity: 0.6,
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
      animationPlayState: "running",
    },
  },
}