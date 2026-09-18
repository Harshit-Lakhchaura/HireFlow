import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

const statuses = ["applied", "reviewing", "shortlisted", "rejected", "hired"];

export default function Applicants() {
  const { id } = useParams();
  const [data, setData] = useState({ applications: [], job: null });

  const load = () => api.get(`/applications/job/${id}`).then((res) => setData(res.data));
  useEffect(() => {
    load();
  }, [id]);

  const change = async (appId, status) => {
    await api.patch(`/applications/${appId}/status`, { status });
    load();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-4xl">Applicants</h1>
      <p className="mt-1 text-ink/60">{data.job?.title}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50">
              <th className="py-2 pr-4">Candidate</th>
              <th className="py-2 pr-4">Skills</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Resume</th>
            </tr>
          </thead>
          <tbody>
            {data.applications.map((a) => (
              <tr key={a._id} className="border-b border-ink/5">
                <td className="py-3 pr-4">
                  <p className="font-semibold">{a.seeker?.name}</p>
                  <p className="text-ink/50">{a.seeker?.email}</p>
                </td>
                <td className="py-3 pr-4">{(a.seeker?.skills || []).join(", ") || "—"}</td>
                <td className="py-3 pr-4">
                  <select value={a.status} onChange={(e) => change(a._id, e.target.value)}>
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  {a.resumeUrl ? (
                    <a className="text-forest" href={a.resumeUrl} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.applications.length === 0 && <p className="mt-6 text-ink/60">No applications yet.</p>}
      </div>
    </div>
  );
}
