// Built-in MUI theme API. One place for readable form controls and brand colors.
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: { main: "#315cff", dark: "#2042cd", contrastText: "#ffffff" },
    secondary: { main: "#ff6b3d", contrastText: "#101729" },
    text: { primary: "#101729", secondary: "#4b586d" },
    background: { default: "#f7f7f2", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: 16,
    body1: { fontSize: "1.125rem", lineHeight: 1.75 },
    body2: { fontSize: "1rem", lineHeight: 1.7 },
    button: { textTransform: "none", fontSize: "1rem", fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { padding: "14px 25px", borderRadius: 100, minHeight: 54 },
      },
    },
    MuiTextField: { defaultProps: { variant: "outlined", size: "medium" } },
    MuiOutlinedInput: {
      styleOverrides: { root: { backgroundColor: "#fff", fontSize: 17 } },
    },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 24 } } },
  },
});
export default theme;
