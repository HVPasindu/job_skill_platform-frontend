import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "Members" },
  { value: "100+", label: "Open Jobs" },
  { value: "50+", label: "Courses" },
  { value: "30+", label: "Companies" },
];

const roles = [
  {
    icon: "💼",
    title: "Job Seekers",
    desc: "Create your profile, add skills and experience, upload documents, and apply for jobs that match your goals.",
    bg: "bg-blue-100",
  },
  {
    icon: "🏢",
    title: "Employers",
    desc: "Create companies, post job openings, review applicants, and find the right talent for your team — fast.",
    bg: "bg-emerald-100",
  },
  {
    icon: "🎓",
    title: "Trainers",
    desc: "Share your expertise by creating courses, uploading materials, and guiding learners through mentorship sessions.",
    bg: "bg-violet-100",
  },
];

const values = [
  { title: "Accessibility", desc: "Career growth should be available to everyone, not just a few." },
  { title: "Transparency", desc: "Clear, honest processes for jobs, applications, and courses." },
  { title: "Community", desc: "We grow together as job seekers, employers, and trainers." },
  { title: "Quality", desc: "Every job post, course, and session meets a high standard." },
];

function About() {
  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-4">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          About SkillJob
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          We connect talent,<br />
          companies, &{" "}
          <span className="text-[#00a6fb]">trainers.</span>
        </h1>

        <div className="w-14 h-1 bg-[#00a6fb] rounded-full my-7" />

        <p className="text-lg text-gray-500 max-w-xl leading-relaxed">
          SkillJob is a platform designed to bring job seekers, employers, and trainers together —
          making career growth simpler and more accessible for everyone.
        </p>
      </section>

      {/* MISSION BANNER */}
      <section className="mx-6 md:mx-auto max-w-5xl mt-12 bg-[#0b132b] rounded-3xl p-10 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="text-6xl">🚀</div>
        <div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Our Mission</h2>
          <p className="text-blue-200 text-base leading-relaxed">
            To create a seamless bridge between opportunity and talent. We believe every person
            deserves access to quality jobs, learning resources, and expert mentorship — all in one place.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 text-center border border-blue-50">
            <p className="text-4xl font-extrabold text-[#00a6fb]">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </section>

      {/* WHO WE SERVE */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <p className="text-[#00a6fb] font-bold text-xs uppercase tracking-widest mb-2">Who we serve</p>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Built for three types of users</h2>

        <div className="grid md:grid-cols-3 gap-5">
          {roles.map((r, i) => (
            <div key={i} className="bg-white rounded-2xl p-7 border border-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${r.bg}`}>
                {r.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Our core values</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {values.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-blue-50 flex items-start gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00a6fb] mt-1.5 shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold">{v.title}</span> — {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-6 md:mx-auto max-w-5xl mb-20 bg-[#00a6fb] rounded-3xl px-10 py-14 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-3">Ready to join SkillJob?</h2>
        <p className="text-blue-100 text-base mb-8">
          Sign up free and start your journey — whether you're hiring, learning, or teaching.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/signup"
            className="bg-white text-[#00a6fb] font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-all"
          >
            Get Started Free
          </Link>
          <Link
            to="/contact"
            className="border-2 border-white text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white hover:text-[#00a6fb] transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;