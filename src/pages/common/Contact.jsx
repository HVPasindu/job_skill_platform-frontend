import { Link } from "react-router-dom";

const contactCards = [
  {
    icon: "📧",
    title: "Email Us",
    detail: "support@skilljob.com",
    href: "mailto:support@skilljob.com",
    note: "We reply within 24 hours",
    bg: "bg-blue-100",
  },
  {
    icon: "📞",
    title: "Call Us",
    detail: "+94 77 123 4567",
    href: "tel:+94771234567",
    note: "Mon – Fri, 9am – 6pm",
    bg: "bg-emerald-100",
  },
  {
    icon: "📍",
    title: "Visit Us",
    detail: "Colombo 03, Sri Lanka",
    href: null,
    note: null,
    bg: "bg-violet-100",
  },
];

const hours = [
  { day: "Mon – Fri", time: "9:00 AM – 6:00 PM" },
  { day: "Saturday", time: "9:00 AM – 1:00 PM" },
  { day: "Sunday", time: "Closed" },
  { day: "Public Holidays", time: "Closed" },
];

function Contact() {
  return (
    <div className="bg-[#f7fbff]">

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-4">
        <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          Contact Us
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Get in touch<br />
          with <span className="text-[#00a6fb]">SkillJob.</span>
        </h1>

        <div className="w-14 h-1 bg-[#00a6fb] rounded-full my-7" />

        <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
          Have a question about jobs, courses, or your account? We're here to help you every step of the way.
        </p>
      </section>

      {/* CONTACT CARDS */}
      <section className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-5">
        {contactCards.map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-8 border border-blue-50 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 ${c.bg}`}>
              {c.icon}
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{c.title}</h3>
            {c.href ? (
              <a href={c.href} className="text-[#00a6fb] font-semibold text-sm">{c.detail}</a>
            ) : (
              <p className="text-gray-600 text-sm">{c.detail}</p>
            )}
            {c.note && <p className="text-gray-400 text-xs mt-2">{c.note}</p>}
          </div>
        ))}
      </section>

      {/* OFFICE HOURS + LOCATION */}
      <section className="max-w-5xl mx-auto px-6 pb-12">
        <div className="bg-[#0b132b] rounded-3xl p-10 md:p-12 grid md:grid-cols-2 gap-10">

          {/* Hours */}
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Office Hours</h2>
            <p className="text-blue-300 text-sm mb-6">Come visit us or reach out during these times</p>
            <div className="grid grid-cols-2 gap-3">
              {hours.map((h, i) => (
                <div key={i} className="bg-blue-900/30 rounded-xl p-4">
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-wider">{h.day}</p>
                  <p className="text-white font-bold mt-1 text-sm">{h.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Location + Social */}
          <div>
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-2xl p-6 text-center">
              <p className="text-white font-bold text-base mb-1">SkillJob HQ</p>
              <p className="text-blue-300 text-sm">Colombo 03, Western Province<br />Sri Lanka 🇱🇰</p>
            </div>

            <div className="mt-6">
              <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-3">Follow us</p>
              <div className="flex gap-3 flex-wrap">
                {["LinkedIn", "Twitter", "Facebook"].map((s, i) => (
                  <span key={i} className="bg-blue-900/30 text-[#00a6fb] text-xs font-bold px-4 py-2 rounded-xl">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-[#00a6fb] rounded-3xl px-10 py-14 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to get started?</h2>
          <p className="text-blue-100 text-base mb-8">
            Join thousands of job seekers, employers, and trainers on SkillJob.
          </p>
          <Link
            to="/signup"
            className="bg-white text-[#00a6fb] font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Contact;