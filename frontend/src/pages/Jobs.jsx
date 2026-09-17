import { useEffect, useState } from "react";
import api from "../api/client";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ jobs: [], pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(q);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/jobs", { params: { q: search, type, level, location, page, limit: 9 } })
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [search, type, level, location, page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Find a role</h1>
      <p className="mt-2 text-ink/60">Filter by keyword, type, level, and city.</p>
      <div className="card mt-6 grid gap-3 p-4 md:grid-cols-4">
        <input placeholder="Search title or skill" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={type} onChange={(e) => { setPage(1); setType(e.target.value); }}>
          <option value="">All types</option>
          {["full-time", "part-time", "contract", "internship", "remote"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={level} onChange={(e) => { setPage(1); setLevel(e.target.value); }}>
          <option value="">All levels</option>
          {["intern", "junior", "mid", "senior", "lead"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input placeholder="Location" value={location} onChange={(e) => { setPage(1); setLocation(e.target.value); }} />
      </div>
      <p className="mt-4 text-sm text-ink/50">{data.total} roles</p>
      {loading ? (
        <p className="py-16 text-center text-ink/50">Loading jobs…</p>
      ) : data.jobs.length === 0 ? (
        <p className="py-16 text-center text-ink/50">No roles match those filters.</p>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center gap-2">
        <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span className="px-3 py-2 text-sm">Page {page} / {data.pages}</span>
        <button className="btn-ghost" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
