import { useNavigate } from "react-router-dom";
// Built-in MUI TextField/select provides a labelled role picker.
import { MenuItem, TextField } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { ROLE_DETAILS, roleHome } from "../../data/roles";
export default function RoleSwitcher({ onSwitch }) {
  const { user, activeRole, switchRole } = useAuth();
  const navigate = useNavigate();
  if (!user.roles.length) return <p>No workspace assigned</p>;
  return (
    <TextField
      select
      fullWidth
      label="Your workspace"
      size="small"
      value={activeRole || ""}
      onChange={(event) => {
        if (switchRole(event.target.value)) {
          navigate(roleHome(event.target.value));
          onSwitch?.();
        }
      }}
    >
      {user.roles.map((role) => (
        <MenuItem key={role} value={role}>
          {ROLE_DETAILS[role].label}
        </MenuItem>
      ))}
    </TextField>
  );
}
