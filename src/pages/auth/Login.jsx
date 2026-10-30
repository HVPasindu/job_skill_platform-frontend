import { useState } from "react";
// Built-in React Router Link for normal navigation.
import { Link } from "react-router-dom";
// Built-in MUI controls provide accessible inputs, adornments and icon buttons.
import { TextField, InputAdornment, IconButton } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
// react-hot-toast provides the temporary information message. Authentication is Step 02.
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import Reveal from "../../components/experience/Reveal";
import OrbitAccent from "../../components/experience/OrbitAccent";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function handleSubmit(event) {
    event.preventDefault();
    toast("Sign-in is being prepared. Please check back soon.");
  }
  return (
    <main className="auth-page">
      <div className="auth-art">
        <Link to="/" className="brand">
          <span className="brand-mark">↗</span>skilljob.
        </Link>
        <Reveal>
          <span className="eyebrow">KEEP YOUR AMBITION MOVING</span>
          <h1>
            A new day.
            <br />A new
            <br />
            <em>direction.</em>
          </h1>
          <p>Your next opportunity starts with you.</p>
        </Reveal>
        <OrbitAccent />
      </div>
      <div className="auth-content">
        <Reveal className="auth-card">
          <Link to="/" className="auth-back">
            ← Back to SkillJob
          </Link>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>
            Ready for
            <br />
            what’s next?
          </h2>
          <p>Sign in to continue your journey.</p>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              type="email"
              label="Email address"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              required
              label="Password"
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        onClick={() => setShowPassword((current) => !current)}
                        edge="end"
                      >
                        {showPassword ? (
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
            <Button type="submit" fullWidth>
              Continue →
            </Button>
          </form>
          <p className="auth-footnote">
            A world of possibilities. One place to begin.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
