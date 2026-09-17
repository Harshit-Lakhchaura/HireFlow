import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api
      .get("/jobs", { params: { limit: 6 } })
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-forest">MERN job marketplace</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-6xl">
            Hire people. Find work. Keep the pipeline moving.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/70">
            Search roles, apply with a resume, and manage applications — or post jobs as a recruiter with a live candidate board.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/jobs" className="btn-primary">Browse jobs</Link>
            {!user && <Link to="/register" className="btn-accent">Create account</Link>}
          </div>
        </div>
        <div className="card relative overflow-hidden p-6">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber/30" />
          <p className="text-sm font-semibold text-ink/50">Live demo accounts</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="rounded-xl bg-paper p-3">Seeker — seeker@hireflow.dev / Seeker@123</li>
            <li className="rounded-xl bg-paper p-3">Recruiter — recruiter@hireflow.dev / Recruiter@123</li>
            <li className="rounded-xl bg-paper p-3">Admin — admin@hireflow.dev / Admin@123</li>
          </ul>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl">Open roles</h2>
          <Link to="/jobs" className="text-sm font-semibold text-forest">See all</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>
    </div>
  );
}
