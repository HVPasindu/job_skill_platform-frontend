import { lazy, Suspense } from "react";
// React Router maps routes; lazy/Suspense loads secondary page code only on demand.
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Home from "../pages/common/Home";
import Loading from "../components/ui/Loading";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";
import useAuth from "../hooks/useAuth";
import { roleHome } from "../data/roles";
const About = lazy(() => import("../pages/common/About"));
const Contact = lazy(() => import("../pages/common/Contact"));
const PublicJobs = lazy(() => import("../pages/common/PublicJobs"));
const PublicCourses = lazy(() => import("../pages/common/PublicCourses"));
const PublicSessions = lazy(() => import("../pages/common/PublicSessions"));
const NotFound = lazy(() => import("../pages/common/NotFound"));
const Login = lazy(() => import("../pages/auth/Login"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const VerifyEmail = lazy(() => import("../pages/auth/VerifyEmail"));
const BecomeTrainer = lazy(() => import("../pages/auth/BecomeTrainer"));
const DashboardLayout = lazy(
  () => import("../components/layout/DashboardLayout"),
);
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"));
const Account = lazy(() => import("../pages/dashboard/Account"));
const SeekerLayout = lazy(() => import("../components/layout/SeekerLayout"));
const Profile = lazy(() => import("../pages/seeker/Profile"));
const Education = lazy(() => import("../pages/seeker/Education"));
const Experience = lazy(() => import("../pages/seeker/Experience"));
const Skills = lazy(() => import("../pages/seeker/Skills"));
const Documents = lazy(() => import("../pages/seeker/Documents"));
const ResumeInsights = lazy(() => import("../pages/seeker/ResumeInsights"));
const JobDetails = lazy(() => import("../pages/common/JobDetails"));
const ApplyJob = lazy(() => import("../pages/seeker/ApplyJob"));
const MyApplications = lazy(() => import("../pages/seeker/MyApplications"));
const ApplicationDetails = lazy(
  () => import("../pages/seeker/ApplicationDetails"),
);
function publicPage(page) {
  return (
    <MainLayout>
      <Suspense fallback={<Loading label="Opening your next chapter…" />}>
        {page}
      </Suspense>
    </MainLayout>
  );
}
function deferred(page) {
  return (
    <Suspense fallback={<Loading label="Opening your workspace…" />}>
      {page}
    </Suspense>
  );
}
export default function AppRoutes() {
  const { activeRole } = useAuth();
  return (
    <Routes>
      <Route path="/" element={publicPage(<Home />)} />
      <Route path="/about" element={publicPage(<About />)} />
      <Route path="/contact" element={publicPage(<Contact />)} />
      <Route path="/jobs" element={publicPage(<PublicJobs />)} />
      <Route path="/jobs/:jobId" element={publicPage(<JobDetails />)} />
      <Route path="/courses" element={publicPage(<PublicCourses />)} />
      <Route path="/sessions" element={publicPage(<PublicSessions />)} />
      <Route element={<GuestRoute />}>
        <Route path="/login" element={deferred(<Login />)} />
        <Route path="/signup" element={deferred(<Signup />)} />
        <Route path="/verify-email" element={deferred(<VerifyEmail />)} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={deferred(<DashboardLayout />)}>
          <Route
            index
            element={<Navigate to={roleHome(activeRole)} replace />}
          />
          <Route path="account" element={deferred(<Account />)} />
          <Route path="become-trainer" element={deferred(<BecomeTrainer />)} />
          <Route element={deferred(<SeekerLayout />)}>
            <Route
              path="job-seeker/apply/:jobId"
              element={deferred(<ApplyJob />)}
            />
            <Route
              path="job-seeker/applications"
              element={deferred(<MyApplications />)}
            />
            <Route
              path="job-seeker/applications/:applicationId"
              element={deferred(<ApplicationDetails />)}
            />
            <Route path="job-seeker/profile" element={deferred(<Profile />)} />
            <Route
              path="job-seeker/education"
              element={deferred(<Education />)}
            />
            <Route
              path="job-seeker/experience"
              element={deferred(<Experience />)}
            />
            <Route path="job-seeker/skills" element={deferred(<Skills />)} />
            <Route
              path="job-seeker/documents"
              element={deferred(<Documents />)}
            />
            <Route
              path="job-seeker/resume-insights"
              element={deferred(<ResumeInsights />)}
            />
          </Route>
          <Route path=":rolePath" element={deferred(<DashboardHome />)} />
        </Route>
      </Route>
      <Route path="*" element={publicPage(<NotFound />)} />
    </Routes>
  );
}
