# React Image Annotate

[![npm version](https://img.shields.io/npm/v/@asi/react-image-annotate.svg)](https://www.npmjs.com/package/@amnstak/react-image-annotate)

<!-- Fork of react-image-annotate - The best image/video annotation tool
ever. [Check out the demo here](https://codesandbox.io/s/react-image-annotate-example-38tsc?file=/src/App.js:0-403). -->

Implemented features in fork:

- added typescript
- changed seamless immutability to immer
- updated npm and dependencies used by project
- updated react to v.19

## Features

- Simple input/output format
- Bounding Box, Point and Polygon Annotation
- Zooming, Scaling, Panning
- Multiple Images
- Cursor Crosshair

![Screenshot of Annotator](https://user-images.githubusercontent.com/1910070/51199716-83c72080-18c5-11e9-837c-c3a89c8caef4.png)

## Usage

`npm i @amnstak/react-image-annotate`

```javascript
import React from "react";
import Annotator from "@amnstak/react-image-annotate";

const App = () => (
  <Annotator
    regionClsList={["car", "truck"]}
    enabledTools={["select", "create-polygon"]}
    selectedTool="select"
    images={[
      {
          src: "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
          name: "car-image-1",
        },
    ]}
    onPrevImages={(state) => {
      console.log(state);
    }}
    onNextImages={(state) => {
      console.log(state);
    }}
    onExit={(output) => {
      console.log({output});
    }}
  />
);

export default App;
```

To get the proper fonts, make sure to import the Inter UI or Roboto font, the
following line added to a css file should suffice.

```css
@import url("https://rsms.me/inter/inter.css");
```

## Props

All of the following properties can be defined on the Annotator...

Refer `AnnotatorProps`

`import { AnnotatorProps } from "@amnstak/react-image-annotate";`

It has a complete details of the accepted props