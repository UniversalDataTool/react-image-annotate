# React Image Annotate

[![npm version](https://badge.fury.io/js/react-image-annotate.svg)](https://badge.fury.io/js/react-image-annotate)

The best image/video annotation tool ever. [Check out the demo here](https://workaroundonline.github.io/react-image-annotate/).

## Features

* Simple input/output format
* Bounding Box, Point and Polygon Annotation
* Zooming, Scaling, Panning
* Multiple Images
* Cursor Crosshair


![Screenshot of Annotator](https://user-images.githubusercontent.com/1910070/51199716-83c72080-18c5-11e9-837c-c3a89c8caef4.png)

## Usage

`npm install react-image-annotate`

```javascript
import Annotator from "react-image-annotate/Annotator"

const App = () => (
  <Annotator
    selectedImage="https://example.com/image1.png"
    taskDescription="# Draw region around each face\n\nInclude chin and hair."
    images={[{ src: "https://example.com/image1.png", name: "Image 1" }]}
    regionClsList={["Man Face", "Woman Face"]}
  />
)
```

## Developers

### Development

This project uses [react-storybook](https://storybook.js.org/). To begin developing run the following commands in the cloned repo.

1. `yarn install`
2. `yarn storybook`

A browser tab will automatically open with the project components.

### Icons

Consult these icon repositories:

- [Material Icons](https://material.io/tools/icons/)
- [Font Awesome Icons](https://fontawesome.com/icons?d=gallery&m=free)
