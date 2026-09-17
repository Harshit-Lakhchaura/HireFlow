import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Applications() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/applications/me").then((res) => setRows(res.data.applications));
  }, []);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl">Your applications</h1>
      <div className="mt-6 space-y-3">
        {rows.map((a) => (
          <div key={a._id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link to={`/jobs/${a.job?._id}`} className="font-semibold hover:underline">
                {a.job?.title}
              </Link>
              <p className="text-sm text-ink/60">{a.job?.company?.name} · {a.job?.location}</p>
            </div>
            <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold capitalize">{a.status}</span>
          </div>
        ))}
        {rows.length === 0 && <p className="text-ink/60">You have not applied yet.</p>}
      </div>
    </div>
  );
}
