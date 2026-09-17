import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";

const empty = {
  title: "",
  description: "",
  location: "",
  type: "full-time",
  experienceLevel: "mid",
  salaryMin: "",
  salaryMax: "",
  skills: "",
  status: "open",
};

export default function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    api.get(`/jobs/${id}`).then((res) => {
      const j = res.data.job;
      setForm({
        title: j.title,
        description: j.description,
        location: j.location,
        type: j.type,
        experienceLevel: j.experienceLevel,
        salaryMin: j.salaryMin || "",
        salaryMax: j.salaryMax || "",
        skills: (j.skills || []).join(", "),
        status: j.status,
      });
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const payload = {
      ...form,
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    };
    try {
      if (id) await api.put(`/jobs/${id}`, payload);
      else await api.post("/jobs", payload);
      navigate("/recruiter/jobs");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl">{id ? "Edit job" : "Post a job"}</h1>
      <form className="card mt-6 space-y-4 p-6" onSubmit={submit}>
        <input placeholder="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea rows="6" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
        <div className="grid gap-3 md:grid-cols-2">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {["full-time", "part-time", "contract", "internship", "remote"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}>
            {["intern", "junior", "mid", "senior", "lead"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input type="number" placeholder="Salary min (INR)" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} />
          <input type="number" placeholder="Salary max (INR)" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} />
        </div>
        <input placeholder="Skills, comma separated" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="open">open</option>
          <option value="closed">closed</option>
        </select>
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button className="btn-primary">{id ? "Update job" : "Publish job"}</button>
      </form>
    </div>
  );
}
