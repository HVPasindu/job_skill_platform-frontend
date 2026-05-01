import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="min-h-screen bg-blue-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow p-8">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-700">
            SkillJob
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mt-6">
            Login
          </h1>

          <p className="text-gray-600 mt-2">
            Welcome back to your account
          </p>
        </div>

        <div className="space-y-5">
          <TextField label="Email" type="email" fullWidth />
          <TextField label="Password" type="password" fullWidth />

          <Button variant="contained" size="large" fullWidth>
            Login
          </Button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-700 font-semibold">
            Signup
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;