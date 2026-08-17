import RegisterPage from "./pages/RegisterPage";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

/* =========================================
   JOB SEEKER
========================================= */

import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import JobSeekerApplications from "./pages/JobSeekerApplications";
import JobSeekerCompanies from "./pages/JobSeekerCompanies";
import JobSeekerStartups from "./pages/JobSeekerStartups";
import JobSeekerAnalytics from "./pages/JobSeekerAnalytics";
import ResumeUpload from "./pages/ResumeUpload";
import JobSeekerProfile from "./pages/JobSeekerProfile";

/* =========================================
   RECRUITER
========================================= */

import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterProfile from "./pages/RecruiterProfile";
import PostJobPage from "./pages/PostJobPage";
import CompanyPage from "./pages/CompanyPage";
import ApplicantsPage from "./pages/ApplicantsPage";
import AnalyticsPage from "./pages/AnalyticsPage";

/* =========================================
   STARTUPS
========================================= */

import StartupPage from "./pages/StartupPage";

/* =========================================
   ADMIN
========================================= */

import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminUsers from "./pages/AdminUsers";
import AdminCompanies from "./pages/AdminCompanies";
import AdminJobs from "./pages/AdminJobs";
import AdminReports from "./pages/AdminReports";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
            DEFAULT
        ================================================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =================================================
            AUTHENTICATION
        ================================================= */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* =================================================
            JOB SEEKER
        ================================================= */}

        <Route
          path="/job-seeker/dashboard"
          element={<JobSeekerDashboard />}
        />

        <Route
          path="/job-seeker/applications"
          element={<JobSeekerApplications />}
        />

        <Route
          path="/job-seeker/companies"
          element={<JobSeekerCompanies />}
        />

        <Route
          path="/job-seeker/startups"
          element={<JobSeekerStartups />}
        />

        <Route
          path="/job-seeker/resume"
          element={<ResumeUpload />}
        />

        <Route
          path="/job-seeker/analytics"
          element={<JobSeekerAnalytics />}
        />

        <Route
          path="/job-seeker/profile"
          element={<JobSeekerProfile />}
        />

        {/* =================================================
            RECRUITER
        ================================================= */}

        <Route
          path="/recruiter/dashboard"
          element={<RecruiterDashboard />}
        />

        <Route
          path="/recruiter/profile"
          element={<RecruiterProfile />}
        />

        <Route
          path="/recruiter/post-job"
          element={<PostJobPage />}
        />

        <Route
          path="/recruiter/post-job/:id"
          element={<PostJobPage />}
        />

        <Route
          path="/recruiter/company"
          element={<CompanyPage />}
        />

        <Route
          path="/recruiter/jobs/:id/applicants"
          element={<ApplicantsPage />}
        />

        <Route
          path="/recruiter/applicants"
          element={<ApplicantsPage />}
        />

        <Route
          path="/recruiter/analytics"
          element={<AnalyticsPage />}
        />

        {/* =================================================
            STARTUPS
        ================================================= */}

        <Route
          path="/startups"
          element={<StartupPage />}
        />

        {/* =================================================
            ADMIN
        ================================================= */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin/companies"
          element={<AdminCompanies />}
        />

        <Route
          path="/admin/jobs"
          element={<AdminJobs />}
        />

        <Route
          path="/admin/reports"
          element={<AdminReports />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;