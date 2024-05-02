// @flow

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";

// const useStyles = makeStyles(() => ({
//   container: {
//     fontFamily: '"Inter", sans-serif',
//   },
// }));

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

export const Theme = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      {/* <div className={classes.container}>{children}</div> */}
      <div>{children}</div>
    </ThemeProvider>
  );
};

export default Theme;
