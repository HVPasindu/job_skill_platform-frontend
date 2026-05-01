import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>{children}</main>

      <footer className="bg-gray-900 text-white py-6 mt-16">
        <p className="text-center text-sm">
          © 2026 SkillJob Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default MainLayout;