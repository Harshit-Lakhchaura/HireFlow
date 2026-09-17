import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { formatSalary } from "../components/JobCard";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = () => {
    api.get(`/jobs/${id}`).then((res) => setPayload(res.data));
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!payload) return <p className="py-20 text-center">Loading role…</p>;
  const { job, applicants, saved, applied } = payload;

  const apply = async (e) => {
    e.preventDefault();
    setErr("");
    if (!user) return navigate("/login");
    try {
      const form = new FormData();
      form.append("jobId", job._id);
      form.append("coverLetter", coverLetter);
      if (file) form.append("resume", file);
      await api.post("/applications", form, { headers: { "Content-Type": "multipart/form-data" } });
      setMsg("Application sent.");
      load();
    } catch (error) {
      setErr(error.message);
    }
  };

  const toggleSave = async () => {
    if (!user) return navigate("/login");
    await api.post(`/jobs/${job._id}/save`);
    load();
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <article className="card p-6 md:p-8">
        <p className="text-sm font-semibold text-forest">{job.company?.name}</p>
        <h1 className="mt-2 font-display text-4xl">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-mist px-3 py-1 capitalize">{job.type}</span>
          <span className="rounded-full bg-mist px-3 py-1">{job.location}</span>
          <span className="rounded-full bg-mist px-3 py-1 capitalize">{job.experienceLevel}</span>
          <span className="rounded-full bg-mist px-3 py-1">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        <p className="mt-6 whitespace-pre-wrap leading-7 text-ink/80">{job.description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills?.map((s) => (
            <span key={s} className="rounded-full border border-ink/10 px-3 py-1 text-sm">{s}</span>
          ))}
        </div>
      </article>
      <aside className="space-y-4">
        <div className="card p-5">
          <p className="text-sm text-ink/60">{applicants} applicants</p>
          {user?.role === "seeker" && (
            <button className="btn-ghost mt-3 w-full" onClick={toggleSave}>
              {saved ? "Saved" : "Save job"}
            </button>
          )}
          {user && String(job.recruiter?._id || job.recruiter) === String(user.id) && (
            <Link to={`/recruiter/jobs/${job._id}/applicants`} className="btn-primary mt-3 w-full">
              View applicants
            </Link>
          )}
        </div>
        {user?.role === "seeker" && (
          <form className="card space-y-3 p-5" onSubmit={apply}>
            <h2 className="font-display text-2xl">Apply</h2>
            {applied ? (
              <p className="text-sm text-forest">You already applied to this role.</p>
            ) : (
              <>
                <textarea rows="5" placeholder="Short cover letter" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
                <button className="btn-primary w-full">Submit application</button>
              </>
            )}
            {msg && <p className="text-sm text-forest">{msg}</p>}
            {err && <p className="text-sm text-red-700">{err}</p>}
          </form>
        )}
        {!user && (
          <div className="card p-5">
            <p className="text-sm">Log in as a seeker to apply.</p>
            <Link to="/login" className="btn-primary mt-3 w-full">Log in</Link>
          </div>
        )}
      </aside>
    </div>
  );
}
