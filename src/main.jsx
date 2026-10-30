// Built-in providers: React Router handles navigation; MUI supplies theme/styles.
// MotionConfig respects reduced-motion settings; Toaster comes from react-hot-toast.
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { MotionConfig } from "motion/react";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import theme from "./theme";
import "./index.css";
import "./components/experience/experience.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <CssBaseline />
        <MotionConfig reducedMotion="user">
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </MotionConfig>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>,
);
