// @flow

import * as muiColors from "@material-ui/core/colors"

export const colors = [
  muiColors.red[500],
  muiColors.blue[500],
  muiColors.green[500],
  muiColors.orange[800],
  muiColors.brown[500],
  muiColors.lightGreen[700],
  muiColors.pink[500],
  muiColors.purple[500],
  muiColors.indigo[500],
  muiColors.teal[500],
  muiColors.lime[500],
  muiColors.blueGrey[500],
]

export const colorInts: Array<number> = colors.map(
  (c) => (parseInt(c.substr(1), 16) | 0xff000000) >>> 0
)

console.log(colorInts)

export default colors
