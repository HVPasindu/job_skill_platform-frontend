import { lazy, Suspense } from "react";
// React Router built-ins map URLs to pages. React.lazy splits secondary routes into chunks.
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/common/Home";
import Loading from "../components/ui/Loading";
const About = lazy(() => import("../pages/common/About"));
const Contact = lazy(() => import("../pages/common/Contact"));
const PublicJobs = lazy(() => import("../pages/common/PublicJobs"));
const PublicCourses = lazy(() => import("../pages/common/PublicCourses"));
const PublicSessions = lazy(() => import("../pages/common/PublicSessions"));
const NotFound = lazy(() => import("../pages/common/NotFound"));
const Login = lazy(() => import("../pages/auth/Login"));
function publicPage(page) {
  return (
    <MainLayout>
      <Suspense fallback={<Loading label="Opening your next chapter…" />}>
        {page}
      </Suspense>
    </MainLayout>
  );
}
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={publicPage(<Home />)} />
      <Route path="/about" element={publicPage(<About />)} />
      <Route path="/contact" element={publicPage(<Contact />)} />
      <Route path="/jobs" element={publicPage(<PublicJobs />)} />
      <Route path="/courses" element={publicPage(<PublicCourses />)} />
      <Route path="/sessions" element={publicPage(<PublicSessions />)} />
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        }
      />
      <Route path="*" element={publicPage(<NotFound />)} />
    </Routes>
  );
}
