import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-bold text-blue-700">404</h1>

      <h2 className="text-3xl font-bold text-gray-900 mt-4">
        Page Not Found
      </h2>

      <p className="text-gray-600 mt-3">
        The page you are looking for does not exist.
      </p>

      <Link to="/">
        <Button variant="contained" className="mt-8">
          Go Home
        </Button>
      </Link>
    </section>
  );
}

export default NotFound;