import { useState } from "react";
// MUI adornments and icon buttons provide a keyboard-accessible visibility control.
import { IconButton, InputAdornment } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import FormField from "./FormField";
export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);
  return (
    <FormField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                aria-label={`${visible ? "Hide" : "Show"} ${props.label.toLowerCase()}`}
                aria-pressed={visible}
                onClick={() => setVisible((value) => !value)}
                edge="end"
              >
                {visible ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
