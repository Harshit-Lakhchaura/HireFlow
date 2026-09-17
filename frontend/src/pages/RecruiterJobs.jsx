import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);

  const load = () => api.get("/jobs/mine/posted").then((res) => setJobs(res.data.jobs));
  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this job?")) return;
    await api.delete(`/jobs/${id}`);
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Posted jobs</h1>
        <Link to="/recruiter/jobs/new" className="btn-primary">Post a job</Link>
      </div>
      <div className="mt-6 space-y-3">
        {jobs.map((job) => (
          <div key={job._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{job.title}</p>
              <p className="text-sm text-ink/60">{job.location} · {job.status}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-ghost" to={`/jobs/${job._id}`}>View</Link>
              <Link className="btn-ghost" to={`/recruiter/jobs/${job._id}/edit`}>Edit</Link>
              <Link className="btn-ghost" to={`/recruiter/jobs/${job._id}/applicants`}>Applicants</Link>
              <button className="btn-ghost text-red-700" onClick={() => remove(job._id)}>Delete</button>
            </div>
          </div>
        ))}
        {jobs.length === 0 && <p className="text-ink/60">No jobs yet. Create a company profile first, then post a role.</p>}
      </div>
    </div>
  );
}
