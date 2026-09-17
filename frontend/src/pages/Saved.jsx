import { useEffect, useState } from "react";
import api from "../api/client";
import JobCard from "../components/JobCard";

export default function Saved() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    api.get("/jobs/saved/me").then((res) => setJobs(res.data.jobs));
  }, []);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Saved jobs</h1>
      {jobs.length === 0 ? (
        <p className="mt-8 text-ink/60">No saved roles yet.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
