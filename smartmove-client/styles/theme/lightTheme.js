import {createTheme} from "@mui/material/styles";
import {green, deepOrange} from "@mui/material/colors";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: green,
    secondary: deepOrange,
  },
});

export default lightTheme;
