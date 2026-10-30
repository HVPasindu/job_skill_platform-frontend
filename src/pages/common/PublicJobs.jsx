import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import axios from "axios";

// Example data — API connect kalama meka remove karanna
const exampleJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company_name: "Tech Lanka",
    location: "Colombo",
    job_type: "Full Time",
    work_mode: "On-site",
    salary: "LKR 120k+",
    icon: "💻",
    iconBg: "#dbeafe",
  },
  {
    id: 2,
    title: "Backend Developer",
    company_name: "CodeWorks",
    location: "Kandy",
    job_type: "Full Time",
    work_mode: "Hybrid",
    salary: "LKR 100k+",
    icon: "⚙️",
    iconBg: "#d1fae5",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company_name: "Creative Hub",
    location: "Remote",
    job_type: "Part Time",
    work_mode: "Remote",
    salary: "LKR 80k+",
    icon: "🎨",
    iconBg: "#ede9fe",
  },
  {
    id: 4,
    title: "Mobile Developer",
    company_name: "AppZone",
    location: "Colombo",
    job_type: "Full Time",
    work_mode: "On-site",
    salary: "LKR 130k+",
    icon: "📱",
    iconBg: "#fee2e2",
  },
  {
    id: 5,
    title: "Data Analyst",
    company_name: "InsightCo",
    location: "Remote",
    job_type: "Contract",
    work_mode: "Remote",
    salary: "LKR 90k+",
    icon: "📊",
    iconBg: "#fef9c3",
  },
];

// job_type eka anuwa badge color eka
function getTypeColor(type) {
  if (type === "Full Time") return { bg: "#dbeafe", color: "#1d4ed8" };
  if (type === "Part Time") return { bg: "#fef3c7", color: "#92400e" };
  if (type === "Contract") return { bg: "#fef3c7", color: "#92400e" };
  return { bg: "#f1f5f9", color: "#475569" };
}

function PublicJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(exampleJobs); // mulinma example data
  const [loading, setLoading] = useState(false);

  // API connect karanna ready unama me useEffect eka use karanna
  useEffect(() => {
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/jobs/public");
      setJobs(res.data.jobs);
    } catch (err) {
      console.log("Using example data");
    } finally {
      setLoading(false);
    }
  };

  // API ready unama meka uncomment karanna:
  // fetchJobs();
}, []);

  const handlePostJob = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/employer/create-job");
    }
  };

  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Jobs
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Find your next <span className="text-[#00a6fb]">opportunity.</span>
          </h1>
          <div className="w-14 h-1 bg-[#00a6fb] rounded-full my-5" />
          <p className="text-gray-500 text-lg">
            Browse open positions from top companies in Sri Lanka.
          </p>
        </div>

        <Button
          variant="contained"
          size="large"
          onClick={handlePostJob}
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
          + Post a Job
        </Button>
      </section>

      {/* JOB CARDS — flex wrap */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        {loading ? (
          <p className="text-gray-400 text-center py-20">Loading jobs...</p>
        ) : (
          <div className="flex flex-wrap gap-5">
            {jobs.map((job) => {
              const typeColor = getTypeColor(job.job_type);
              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-blue-50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ flex: "1 1 260px", maxWidth: "340px" }}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: job.iconBg || "#e0f2fe" }}
                    >
                      {job.icon || "💼"}
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-lg"
                      style={{ background: typeColor.bg, color: typeColor.color }}
                    >
                      {job.job_type}
                    </span>
                  </div>

                  {/* Title & company */}
                  <h3 className="text-lg font-extrabold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.company_name} · {job.location}
                  </p>

                  {/* Meta chips */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.work_mode && (
                      <Chip label={job.work_mode} size="small" sx={{ fontSize: 11, fontWeight: 600 }} />
                    )}
                    {job.salary && (
                      <Chip label={job.salary} size="small" sx={{ fontSize: 11, fontWeight: 600 }} />
                    )}
                  </div>

                  {/* Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                      mt: 2,
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
                    View Details
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

export default PublicJobs;