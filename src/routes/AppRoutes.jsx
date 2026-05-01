import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/common/Home";
import About from "../pages/common/About";
import Contact from "../pages/common/Contact";
import PublicJobs from "../pages/common/PublicJobs";
import PublicCourses from "../pages/common/PublicCourses";
import PublicSessions from "../pages/common/PublicSessions";
import NotFound from "../pages/common/NotFound";

import Login from "../pages/auth/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />

      <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        }
      />

      <Route
        path="/jobs"
        element={
          <MainLayout>
            <PublicJobs />
          </MainLayout>
        }
      />

      <Route
        path="/courses"
        element={
          <MainLayout>
            <PublicCourses />
          </MainLayout>
        }
      />

      <Route
        path="/sessions"
        element={
          <MainLayout>
            <PublicSessions />
          </MainLayout>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;