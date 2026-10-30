import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import axios from "axios";

const exampleCourses = [
  {
    id: 1,
    title: "React Basics",
    trainer_name: "Nimal Perera",
    level: "Beginner",
    lesson_count: 12,
    icon: "⚛️",
    thumbBg: "#dbeafe",
    avatarBg: "#dbeafe",
    avatarColor: "#1d4ed8",
    initials: "NP",
  },
  {
    id: 2,
    title: "Node API Development",
    trainer_name: "Kamal Silva",
    level: "Intermediate",
    lesson_count: 18,
    icon: "🔧",
    thumbBg: "#d1fae5",
    avatarBg: "#d1fae5",
    avatarColor: "#065f46",
    initials: "KS",
  },
  {
    id: 3,
    title: "UI/UX Fundamentals",
    trainer_name: "Ashani Silva",
    level: "Beginner",
    lesson_count: 10,
    icon: "🎨",
    thumbBg: "#ede9fe",
    avatarBg: "#ede9fe",
    avatarColor: "#6d28d9",
    initials: "AS",
  },
  {
    id: 4,
    title: "Python for Data Science",
    trainer_name: "Ruwan Fernando",
    level: "Advanced",
    lesson_count: 22,
    icon: "🐍",
    thumbBg: "#fef9c3",
    avatarBg: "#fef9c3",
    avatarColor: "#92400e",
    initials: "RF",
  },
];

// level anuwa badge color
function getLevelColor(level) {
  if (level === "Beginner") return { bg: "#d1fae5", color: "#065f46" };
  if (level === "Intermediate") return { bg: "#fef3c7", color: "#92400e" };
  if (level === "Advanced") return { bg: "#fee2e2", color: "#991b1b" };
  return { bg: "#f1f5f9", color: "#475569" };
}

// trainer name walin initials ganna
function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PublicCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(exampleCourses);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/courses/public");
        setCourses(res.data.courses);
      } catch (err) {
        console.log("Using example data");
      } finally {
        setLoading(false);
      }
    };

    // API ready unama meka uncomment karanna:
    // fetchCourses();
  }, []);

  const handleCreateCourse = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/trainer/create-course");
    }
  };

  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Courses
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Learn new skills from{" "}
            <span className="text-[#00a6fb]">expert trainers.</span>
          </h1>
          <div className="w-14 h-1 bg-[#00a6fb] rounded-full my-5" />
          <p className="text-gray-500 text-lg">
            Browse courses taught by top professionals in Sri Lanka.
          </p>
        </div>

        <Button
          variant="contained"
          size="large"
          onClick={handleCreateCourse}
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
          + Create Course
        </Button>
      </section>

      {/* COURSE CARDS — flex wrap */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading courses...</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {courses.map((course) => {
              const levelColor = getLevelColor(course.level);
              const initials = course.initials || getInitials(course.trainer_name);
              const avatarBg = course.avatarBg || "#dbeafe";
              const avatarColor = course.avatarColor || "#1d4ed8";

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-blue-50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ flex: "1 1 260px", maxWidth: "340px" }}
                >
                  {/* Thumbnail */}
                  <div
                    className="h-36 flex items-center justify-center text-5xl"
                    style={{ background: course.thumbBg || "#dbeafe" }}
                  >
                    {course.icon || "📚"}
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    {/* Level badge */}
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-lg inline-block mb-3"
                      style={{ background: levelColor.bg, color: levelColor.color }}
                    >
                      {course.level}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                      {course.title}
                    </h3>

                    {/* Trainer */}
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: avatarBg, color: avatarColor }}
                      >
                        {initials}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {course.trainer_name}
                      </span>
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.lesson_count && (
                        <Chip
                          label={`${course.lesson_count} lessons`}
                          size="small"
                          sx={{ fontSize: 11, fontWeight: 600 }}
                        />
                      )}
                      <Chip
                        label="Free"
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 600 }}
                      />
                      <Chip
                        label="Certificate"
                        size="small"
                        sx={{ fontSize: 11, fontWeight: 600 }}
                      />
                    </div>

                    {/* Button */}
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        borderRadius: "12px",
                        fontWeight: 700,
                        backgroundColor: "#00a6fb",
                        "&:hover": { backgroundColor: "#0290d8" },
                      }}
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}

export default PublicCourses;