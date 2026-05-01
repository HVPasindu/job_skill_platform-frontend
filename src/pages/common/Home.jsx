import { Link } from "react-router-dom";

const stats = [
  { value: "100+", label: "Jobs", bg: "bg-blue-50", text: "text-blue-600" },
  { value: "50+", label: "Courses", bg: "bg-emerald-50", text: "text-emerald-600" },
  { value: "20+", label: "Trainers", bg: "bg-violet-50", text: "text-violet-600" },
  { value: "30+", label: "Companies", bg: "bg-orange-50", text: "text-orange-600" },
];

const features = [
  {
    icon: "💼",
    title: "Find Jobs",
    desc: "Browse hundreds of open positions from top companies.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: "📚",
    title: "Learn Skills",
    desc: "Enroll in courses taught by experienced trainers.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: "🤝",
    title: "Get Mentored",
    desc: "Join live mentorship sessions and grow your career.",
    color: "bg-emerald-100 text-emerald-600",
  },
];

function Home() {
  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[350px] h-[350px] bg-indigo-100 rounded-full blur-3xl opacity-40" />

        <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
              Job & Skill Development Platform
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Find Jobs &{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[#00a6fb]">Build Skills</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-100 rounded-full z-0" />
              </span>
            </h1>

            <p className="text-gray-500 mt-6 text-lg leading-relaxed max-w-md">
              A powerful platform for job seekers, employers, and trainers. Your next opportunity starts here.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/jobs"
                className="bg-[#00a6fb] hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Jobs
              </Link>
              <Link
                to="/courses"
                className="border-2 border-[#00a6fb] text-[#00a6fb] hover:bg-blue-50 font-semibold px-8 py-3.5 rounded-2xl transition-all duration-200"
              >
                View Courses
              </Link>
            </div>

            {/* Mini trust bar */}
            <div className="mt-12 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["bg-blue-400", "bg-violet-400", "bg-emerald-400", "bg-orange-400"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">500+</span> people joined this month
              </p>
            </div>
          </div>

          {/* Right — Stats Card */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-100 p-8 border border-blue-50">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
                Platform at a glance
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div
                    key={i}
                    className={`${s.bg} rounded-2xl p-6 hover:scale-105 transition-transform duration-200 cursor-default`}
                  >
                    <h3 className={`text-4xl font-extrabold ${s.text}`}>{s.value}</h3>
                    <p className="text-gray-600 font-medium mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Bottom bar */}
              <div className="mt-6 bg-[#0b132b] rounded-2xl p-5 text-white flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-200">Ready to start?</p>
                  <p className="font-bold text-lg">Join for free today</p>
                </div>
                <Link
                  to="/signup"
                  className="bg-[#00a6fb] hover:bg-blue-400 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">
            What we offer
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-3">
            Everything you need in one place
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-50 group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 mt-3 leading-relaxed">{f.desc}</p>

              <div className="mt-6 text-[#00a6fb] font-semibold text-sm group-hover:underline">
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-[#0b132b] rounded-3xl px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-snug">
              Ready to take the next step<br />in your career?
            </h2>
            <p className="text-blue-200 mt-3 text-base">
              Sign up free and start exploring jobs, courses, and mentorship sessions.
            </p>
          </div>
          <div className="flex gap-4 shrink-0">
            <Link
              to="/signup"
              className="bg-[#00a6fb] hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0b132b] font-bold px-8 py-4 rounded-2xl transition-all duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;