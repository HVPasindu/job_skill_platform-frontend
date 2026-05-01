import { Button } from "@mui/material";

function PublicSessions() {
  const sessions = [
    { title: "Career Guidance", trainer: "Saman Kumara", date: "May 10, 2026" },
    { title: "Interview Preparation", trainer: "Dilani Perera", date: "May 15, 2026" },
    { title: "CV Writing Workshop", trainer: "Ruwan Silva", date: "May 20, 2026" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="text-blue-700 font-semibold mb-3">Sessions</p>

      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Upcoming sessions
      </h1>

      <div className="space-y-5">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {session.title}
              </h3>
              <p className="text-gray-600 mt-2">By {session.trainer}</p>
              <p className="text-gray-500 mt-1">{session.date}</p>
            </div>

            <Button variant="outlined">View</Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PublicSessions;