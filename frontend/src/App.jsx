import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Saved from "./pages/Saved";
import Applications from "./pages/Applications";
import Company from "./pages/Company";
import RecruiterJobs from "./pages/RecruiterJobs";
import JobForm from "./pages/JobForm";
import Applicants from "./pages/Applicants";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={["seeker"]}>
                <Applications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/company"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <Company />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute roles={["recruiter", "admin"]}>
                <RecruiterJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/new"
            element={
              <ProtectedRoute roles={["recruiter"]}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/edit"
            element={
              <ProtectedRoute roles={["recruiter", "admin"]}>
                <JobForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs/:id/applicants"
            element={
              <ProtectedRoute roles={["recruiter", "admin"]}>
                <Applicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
