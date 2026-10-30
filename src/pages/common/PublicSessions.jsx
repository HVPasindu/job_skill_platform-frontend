import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import axios from "axios";

const exampleSessions = [
  {
    id: 1,
    title: "Career Guidance",
    trainer_name: "Saman Kumara",
    session_date: "May 10, 2026",
    duration: "1 hr",
    status: "Open",
    icon: "🧭",
    iconBg: "#dbeafe",
    avatarBg: "#dbeafe",
    avatarColor: "#1d4ed8",
  },
  {
    id: 2,
    title: "Interview Preparation",
    trainer_name: "Dilani Perera",
    session_date: "May 15, 2026",
    duration: "1.5 hrs",
    status: "Open",
    icon: "🎤",
    iconBg: "#ede9fe",
    avatarBg: "#ede9fe",
    avatarColor: "#6d28d9",
  },
  {
    id: 3,
    title: "CV Writing Workshop",
    trainer_name: "Ruwan Silva",
    session_date: "May 20, 2026",
    duration: "2 hrs",
    status: "Open",
    icon: "📝",
    iconBg: "#d1fae5",
    avatarBg: "#d1fae5",
    avatarColor: "#065f46",
  },
  {
    id: 4,
    title: "Startup Pitch Coaching",
    trainer_name: "Ashan Kodithuwakku",
    session_date: "May 25, 2026",
    duration: "2 hrs",
    status: "Filling Fast",
    icon: "💡",
    iconBg: "#fef9c3",
    avatarBg: "#fef9c3",
    avatarColor: "#92400e",
  },
];

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getStatusColor(status) {
  if (status === "Open") return { bg: "#d1fae5", color: "#065f46" };
  if (status === "Filling Fast") return { bg: "#fef3c7", color: "#92400e" };
  if (status === "Full") return { bg: "#fee2e2", color: "#991b1b" };
  return { bg: "#f1f5f9", color: "#475569" };
}

function PublicSessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(exampleSessions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/sessions/public");
        setSessions(res.data.sessions);
      } catch (err) {
        console.log("Using example data");
      } finally {
        setLoading(false);
      }
    };

    // API ready unama meka uncomment karanna:
    // fetchSessions();
  }, []);

  const handleHostSession = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/trainer/create-session");
    }
  };

  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Sessions
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Join upcoming{" "}
            <span className="text-[#00a6fb]">mentorship sessions.</span>
          </h1>
          <div className="w-14 h-1 bg-[#00a6fb] rounded-full my-5" />
          <p className="text-gray-500 text-lg">
            Learn directly from experienced professionals and trainers.
          </p>
        </div>

        <Button
          variant="contained"
          size="large"
          onClick={handleHostSession}
          sx={{
            backgroundColor: "#00a6fb",
            borderRadius: "14px",
            fontWeight: 700,
            px: 4,
            py: 1.5,
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#0290d8" },
          }}
        >
          + Host a Session
        </Button>
      </section>

      {/* SESSION CARDS — flex wrap */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading sessions...</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {sessions.map((session) => {
              const statusColor = getStatusColor(session.status);
              const initials = getInitials(session.trainer_name);

              return (
                <div
                  key={session.id}
                  className="bg-white rounded-2xl border border-blue-50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ flex: "1 1 260px", maxWidth: "420px" }}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: session.iconBg || "#dbeafe" }}
                    >
                      {session.icon || "🎓"}
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-lg"
                      style={{ background: statusColor.bg, color: statusColor.color }}
                    >
                      {session.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                    {session.title}
                  </h3>

                  {/* Trainer */}
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: session.avatarBg || "#dbeafe",
                        color: session.avatarColor || "#1d4ed8",
                      }}
                    >
                      {initials}
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      {session.trainer_name}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm">📅</span>
                    <span className="text-sm text-[#00a6fb] font-bold">
                      {session.session_date}
                    </span>
                  </div>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.duration && (
                      <Chip label={session.duration} size="small" sx={{ fontSize: 11, fontWeight: 600 }} />
                    )}
                    <Chip label="Online" size="small" sx={{ fontSize: 11, fontWeight: 600 }} />
                    <Chip label="Free" size="small" sx={{ fontSize: 11, fontWeight: 600 }} />
                  </div>

                  {/* Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderRadius: "12px",
                      fontWeight: 700,
                      borderColor: "#00a6fb",
                      color: "#00a6fb",
                      "&:hover": {
                        backgroundColor: "#00a6fb",
                        color: "#fff",
                      },
                    }}
                  >
                    View Session
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default PublicSessions;