# Features

- Simple input/output format
- Bounding Box, Point and Polygon Annotation
- Zooming, Scaling, Panning
- Multiple Images
- Cursor Crosshair

![Screenshot of Annotator](https://user-images.githubusercontent.com/1910070/51199716-83c72080-18c5-11e9-837c-c3a89c8caef4.png)

# Usage

## Installation

```bash
npm install react-image-annotate
```

## Basic Example

```javascript
import ReactImageAnnotate from "react-image-annotate"

const App = () => (
  <ReactImageAnnotate
    selectedImage="https://example.com/image1.png"
    taskDescription="# Draw region around each animal."
    images={[{ src: "https://example.com/image1.png", name: "Image 1" }]}
    regionClsList={["Dog", "Cat"]}
    enabledTools={["create-box"]}
  />
)
```

# Props

All of the following properties can be defined on the `ReactImageAnnotate` component...

| Prop                     | Type (\* = required)                             | Description                                                                             | Default       |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| `taskDescription`        | \*`string`                                       | Markdown description for what to do in the image.                                       |               |
| `allowedArea`            | `{ x: number, y: number, w: number, h: number }` | Area that is available for annotation.                                                  | Entire image. |
| `regionTagList`          | `Array<string>`                                  | Allowed "tags" (mutually inclusive classifications) for regions.                        |               |
| `regionClsList`          | `Array<string>`                                  | Allowed "classes" (mutually exclusive classifications) for regions.                     |               |
| `imageTagList`           | `Array<string>`                                  | Allowed tags for entire image.                                                          |               |
| `imageClsList`           | `Array<string>`                                  | Allowed classes for entire image.                                                       |               |
| `enabledTools`           | `Array<string>`                                  | Tools allowed to be used. e.g. "select", "create-point", "create-box", "create-polygon" | Everything.   |
| `showTags`               | `boolean`                                        | Show tags and allow tags on regions.                                                    | `true`        |
| `selectedImage`          | `string`                                         | URL of initially selected image.                                                        |               |
| `images`                 | `Array<Image>`                                   | Array of images to load into annotator                                                  |               |
| `showPointDistances`     | `boolean`                                        | Show distances between points.                                                          | `false`       |
| `pointDistancePrecision` | `number`                                         | Precision on displayed points (e.g. 3 => 0.123)                                         |               |
| `onExit`                 | `MainLayoutState => any`                         | Called when "Save" is called.                                                           |               |

# Sponsors

[![wao.ai sponsorship image](https://s3.amazonaws.com/asset.workaround.online/sponsorship-banner-1.png)](https://wao.ai)
