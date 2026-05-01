import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import desktopBg from "../../assets/auth-bg-desktop.png";
import mobileBg from "../../assets/auth-bg-mobile.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log({
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background image */}
      <picture className="absolute inset-0 -z-10">
        <source media="(max-width: 640px)" srcSet={mobileBg} />
        <img
          src={desktopBg}
          alt="auth background"
          className="w-full h-full object-cover"
        />
      </picture>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/85 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-blue-200/60 border border-white/70 px-7 py-9 sm:px-10 sm:py-11">
          {/* Logo */}
          <Link
            to="/"
            className="block text-center text-[#00a6fb] text-3xl font-extrabold mb-7"
          >
            SkillJob
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-5">
              Welcome Back
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              Login
            </h1>

            <p className="text-gray-500 text-sm mt-3">
              Enter your details to continue your journey
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <TextField
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#00a6fb" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "18px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                  },
                  "& .MuiOutlinedInput-input": {
                    py: "16px",
                  },
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <TextField
                type={showPassword ? "text" : "password"}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#00a6fb" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
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
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "18px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                  },
                  "& .MuiOutlinedInput-input": {
                    py: "16px",
                  },
                }}
              />
            </div>

            <Button
              onClick={handleLogin}
              variant="contained"
              fullWidth
              size="large"
              sx={{
                backgroundColor: "#00a6fb",
                borderRadius: "18px",
                fontWeight: 800,
                py: 1.8,
                mt: 1.5,
                fontSize: "16px",
                textTransform: "none",
                boxShadow: "0 10px 28px rgba(0,166,251,0.35)",
                "&:hover": {
                  backgroundColor: "#0290d8",
                  boxShadow: "0 12px 32px rgba(0,166,251,0.45)",
                },
              }}
            >
              Login to Account
            </Button>
          </div>

          {/* Bottom text */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#00a6fb] font-bold">
              Sign up free
            </Link>
          </p>

           {/* Bottom text */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Go back to Home{" "}
            <Link to="/" className="text-[#00a6fb] font-bold">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;