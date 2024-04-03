import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";

const primaryMain = "#ff90bc";

const theme = createTheme({
  palette: {
    primary: {
      main: primaryMain,
      dark: alpha(primaryMain, 0.9),
      contrastText:
        getContrastRatio(primaryMain, "#fff") > 4.5 ? "#000" : "#fff",
    },
    secondary: {
      main: "#fff",
    },
  },
});

export default theme;
