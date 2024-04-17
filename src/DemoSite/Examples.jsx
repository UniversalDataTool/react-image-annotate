import {createTheme} from "@mui/material/styles"
import {setIn} from 'seamless-immutable';

const userReducer = (state, action) => {
  switch (action.type) {
    case "SELECT_CLASSIFICATION": {
      switch (action.cls) {
        case "Line-Crossing": {
          return setIn(state, ["selectedTool"], "create-line");
        }
        case "Area-Occupancy": {
          return setIn(state, ["selectedTool"], "create-polygon");
        }
      }
    }
  }

  return state;
};

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("customInput") || "{}")
  } catch (e) {
    return {}
  }
}

export const examples = {
  "All Tools": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    // regionTagList: [],
    // regionClsList: ["hotdog"],
    regionTagList: ["has-bun"],
    regionClsList: ["hotdog", "not-hotdog"],
    regionColorList: ["#4d0c89", "#55d68d"],
    preselectCls: "not-hotdog",
    enabledTools: ["create-point", "create-box", "create-polygon", "create-line", "create-expanding-line"],
    // showTags: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1496905583330-eb54c7e5915a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        name: "hot-dogs-1",
      },
      {
        src: "https://www.bianchi.com/wp-content/uploads/2019/07/YPB17I555K.jpg",
        name: "bianchi-oltre-xr4",
      },
    ],
    enabledRegionProps: ["class", "tags", "comment"]
  }),
  "Constrained Tools": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    // regionTagList: [],
    // regionClsList: ["hotdog"],
    regionTagList: ["has-bun"],
    regionClsList: ["Line-Crossing", "Area-Occupancy", "fgfg"],
    preselectCls: "not-hotdog",
    // showTags: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1567563549378-81212b9631e4?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        name: "intersection",
      }
    ],
    userReducer: userReducer,
    enabledRegionProps: ["name"]
  }),
  "Simple Segmentation": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    regionClsList: ["car", "truck"],
    enabledTools: ["select", "create-polygon"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        name: "car-image-1",
      },
    ],
  }),
  Custom: () => loadSavedInput(),
}
