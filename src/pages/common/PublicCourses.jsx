import { Button } from "@mui/material";

function PublicCourses() {
  const courses = [
    { title: "React Basics", trainer: "Nimal Perera", level: "Beginner" },
    { title: "Node API Development", trainer: "Kamal Silva", level: "Intermediate" },
    { title: "UI/UX Fundamentals", trainer: "Ashani Silva", level: "Beginner" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <p className="text-blue-700 font-semibold mb-3">Courses</p>

      <h1 className="text-4xl font-bold text-gray-900 mb-10">
        Public courses
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow">
            <div className="h-32 bg-blue-100 rounded-xl mb-5"></div>

            <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
            <p className="text-gray-600 mt-2">By {course.trainer}</p>
            <p className="text-blue-700 mt-2">{course.level}</p>

            <Button variant="contained" className="mt-5">
              View Course
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PublicCourses;