// Built-in providers: React Router handles navigation; MUI supplies theme/styles.
// MotionConfig respects reduced-motion settings. AuthProvider shares the signed-in session.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { MotionConfig } from "motion/react";
import AuthProvider from "./context/AuthProvider";
import App from "./App.jsx";
import theme from "./theme";
import "./index.css";
import "./styles-auth.css";
import "./components/experience/experience.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <CssBaseline />
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </MotionConfig>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
