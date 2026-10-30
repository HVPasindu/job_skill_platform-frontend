// Built-in MUI Button handles focus, disabled states, variants and keyboard access.
import MuiButton from "@mui/material/Button";
// React Router Link navigates without a full page reload.
import { Link } from "react-router-dom";
import Magnetic from "../experience/Magnetic";
export default function Button({
  to,
  children,
  variant = "contained",
  ...props
}) {
  return (
    <Magnetic>
      <MuiButton
        component={to ? Link : "button"}
        to={to}
        variant={variant}
        {...props}
      >
        {children}
      </MuiButton>
    </Magnetic>
  );
}
