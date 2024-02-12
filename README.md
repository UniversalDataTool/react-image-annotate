# React Image Annotate

## Features

- [API Documentation](docs/content.md)
- Simple input/output format
- Bounding Box, Point and Polygon Annotation
- Zooming, Scaling, Panning
- Multiple Images
- Cursor Crosshair

![Screenshot of Annotator](https://user-images.githubusercontent.com/1910070/51199716-83c72080-18c5-11e9-837c-c3a89c8caef4.png)

## Usage

`npm install react-image-annotate`

```javascript
import React from "react";
import ReactImageAnnotate from "react-image-annotate";

const App = () => (
  <ReactImageAnnotate
    labelImages
    regionClsList={["Alpha", "Beta", "Charlie", "Delta"]}
    regionTagList={["tag1", "tag2", "tag3"]}
    images={[
      {
        src: "https://placekitten.com/408/287",
        name: "Image 1",
        regions: []
      }
    ]}
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

| Prop                     | Type (\* = required)                             | Description                                                                             | Default       |
| ------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------- | ------------- |
| `taskDescription`        | \*`string`                                       | Markdown description for what to do in the image.                                       |               |
| `allowedArea`            | `{ x: number, y: number, w: number, h: number }` | Area that is available for annotation.                                                  | Entire image. |
| `regionTagList`          | `Array<string>`                                  | Allowed "tags" (mutually inclusive classifications) for regions.                        |               |
| `regionClsList`          | `Array<string>`                                  | Allowed "classes" (mutually exclusive classifications) for regions.           
| `regionColorList`        | `Array<string>`                                  | Custom color list for regions. Default colors are used if not specified.
| `preselectCls`          | `string`                                          |  Put in the class that should be preselected when creating a new Box/Polygon etc.           |               |
| `imageTagList`           | `Array<string>`                                  | Allowed tags for entire image.                                                          |               |
| `imageClsList`           | `Array<string>`                                  | Allowed classes for entire image.                                                       |               |
| `enabledTools`           | `Array<string>`                                  | Tools allowed to be used. e.g. "select", "create-point", "create-box", "create-polygon" | Everything.   |
| `showTags`               | `boolean`                                        | Show tags and allow tags on regions.                                                    | `true`        |
| `selectedImage`          | `string`                                         | URL of initially selected image.                                                        |               |
| `images`                 | `Array<Image>`                                   | Array of images to load into annotator                                                  |               |
| `showPointDistances`     | `boolean`                                        | Show distances between points.                                                          | `false`       |
| `pointDistancePrecision` | `number`                                         | Precision on displayed points (e.g. 3 => 0.123)                                         |               |
| `onExit`                 | `MainLayoutState => any`                         | Called when "Save" is called.                                                           |               |
| `RegionEditLabel`        | `Node`                                           | React Node overriding the form to update the region (see [`RegionLabel`](https://github.com/waoai/react-image-annotate/blob/master/src/RegionLabel/index.js))                                                          |               |
| `enabledRegionProps`     | `boolean`                                        | Which properties to show in region edit popup ("class", "tags", "name", "comment")      | [`class`, `name`] |
| `hidePrev`               | `boolean`                                        | Hide `Previous Image` button from the header bar.                                       | `false`       |
| `hideNext`               | `boolean`                                        | Hide `Next Image` button from the header bar.                                           | `false`       |
| `hideClone`              | `boolean`                                        | Hide `Clone` button from the header bar.                                                | `false`       |
| `hideSettings`           | `boolean`                                        | Hide `Settings` button from the header bar.                                             | `false`       |
| `hideFullScreen`         | `boolean`                                        | Hide `FullScreen/Window` button from the header bar.                                    | `false`       |
| `hideSave`               | `boolean`                                        | Hide `Save` button from the header bar.                                                 | `false`       |
| `userReducer`            | `(state, action) => state`                       | User defined reducer that receives every event triggered within the annotator. See demo site for example. | |

## Developers

### Development

To begin developing run the following commands in the cloned repo.

1. `npm install`
2. `npm start`

Then navigate to http://localhost:5173/ and start testing.

See more details in the [contributing guidelines](https://github.com/waoai/react-image-annotate/wiki/Setup-for-Development).

### Icons

Consult these icon repositories:

- [Material Icons](https://material.io/tools/icons/)
- [Font Awesome Icons](https://fontawesome.com/icons?d=gallery&m=free)

### Testdrive in project
To test this package in your project follow this quickstart:
1. Run `npm link` in the root directory of this project (where the `package.json` is located)
2. With the same Terminal window, go to your target project folder where the `package.json` is located
3. Run `npm link "@starwit/react-image-annotate"` to install the package. It might be necessary to remove a previously installed `@starwit/react-image-annotate` package. Please use the same node version when using npm link and executing the application. 
4. Changes to this repository will apply live to the running dev session in your target project :)


### Notes
Currently, there is an issue with vite-plugin-node-polyfills (0.15.0 at the time of writing), 
which shows many warnings while building (related to "use client"). That is expected and will probably be fixed in the future. See here: https://github.com/davidmyersdev/vite-plugin-node-polyfills/issues/49 
