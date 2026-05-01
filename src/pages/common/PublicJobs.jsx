import { Button } from "@mui/material";

function PublicJobs() {
  const jobs = [
    { title: "Frontend Developer", company: "Tech Lanka", location: "Colombo" },
    { title: "Backend Developer", company: "CodeWorks", location: "Kandy" },
    { title: "UI/UX Designer", company: "Creative Hub", location: "Remote" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="text-blue-700 font-semibold mb-3">Jobs</p>

      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Available public jobs
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            <p className="text-gray-600 mt-2">{job.company}</p>
            <p className="text-gray-500 mt-2">{job.location}</p>

            <Button variant="outlined" className="mt-5">
              View Details
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PublicJobs;