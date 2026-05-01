import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f7fbff] min-h-screen flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-xl w-full">

        {/* 404 big number */}
        <div className="flex items-center justify-center gap-1 leading-none mb-2">
          <span className="text-[120px] font-black text-gray-900 tracking-tighter">4</span>

          {/* Styled zero */}
          <div className="w-24 h-24 rounded-full border-4 border-[#00a6fb] relative flex items-center justify-center mx-1">
            <div className="w-4 h-4 bg-[#00a6fb] rounded-full absolute -top-2" />
          </div>

          <span className="text-[120px] font-black text-gray-900 tracking-tighter">4</span>
        </div>

        {/* Dark card */}
        <div className="bg-[#0b132b] rounded-3xl p-10 mt-2">
          <h2 className="text-2xl font-extrabold text-white mb-3">
            Oops! Page not found.
          </h2>
          <p className="text-blue-300 text-base leading-relaxed mb-8">
            The page you're looking for doesn't exist or may have been moved.
            Let's get you back on track.
          </p>

          {/* Main buttons */}
          <div className="flex gap-3 justify-center flex-wrap mb-5">
            <Link to="/">
              <Button
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#00a6fb",
                  borderRadius: "14px",
                  fontWeight: 700,
                  px: 4,
                  "&:hover": { backgroundColor: "#0290d8" },
                }}
              >
                Go Home
              </Button>
            </Link>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: "14px",
                fontWeight: 700,
                px: 4,
                borderColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              Go Back
            </Button>
          </div>

          {/* Quick links */}
          <div className="flex gap-2 justify-center flex-wrap">
            {[
              { label: "Browse Jobs", path: "/jobs" },
              { label: "View Courses", path: "/courses" },
              { label: "Contact Us", path: "/contact" },
            ].map((link) => (
              <Link key={link.path} to={link.path}>
                <span className="inline-block bg-blue-900/40 text-[#00a6fb] text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-900/60 transition-all cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default NotFound;