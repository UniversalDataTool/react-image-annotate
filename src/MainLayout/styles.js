import { grey } from "@material-ui/core/colors"

export default {
  container: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    minHeight: "98vh",
    maxHeight: "100vh",
    overflow: "hidden"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    flexShrink: 0,
    zIndex: 10,
    boxShadow: "0px 3px 8px rgba(0,0,0,.1)"
  },
  fileInfo: {
    flexGrow: 1,
    alignItems: "center",
    display: "flex",
    fontWeight: "bold",
    color: grey[800],
    fontSize: 24,
    paddingLeft: 16
  },
  workspace: {
    backgroundColor: grey[200],
    flexGrow: 1,
    display: "flex",
    flexDirection: "row"
  },
  iconToolsContainer: { display: "flex" },
  imageCanvasContainer: {
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  noImageSelected: {
    fontWeight: "bold",
    fontSize: 32,
    color: grey[500]
  },
  sidebarContainer: {
    width: 300,
    overflowY: "auto",
    backgroundColor: grey[100],
    borderLeft: `1px solid ${grey[300]}`,
    zIndex: 9,
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)"
  }
}
