import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, setUser, refresh } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "",
    bio: user.bio || "",
    skills: (user.skills || []).join(", "),
    location: user.location || "",
    phone: user.phone || "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const save = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const { data } = await api.put("/auth/profile", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setUser(data.user);
      setMsg("Profile updated");
    } catch (error) {
      setErr(error.message);
    }
  };

  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("resume", file);
    try {
      await api.post("/auth/resume", fd);
      await refresh();
      setMsg("Resume uploaded");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl">Your profile</h1>
      <p className="mt-1 text-sm capitalize text-ink/50">{user.role}</p>
      <form className="card mt-6 space-y-4 p-6" onSubmit={save}>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        <textarea rows="4" placeholder="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        {user.role === "seeker" && (
          <div>
            <p className="mb-2 text-sm font-medium">Resume</p>
            <input type="file" accept=".pdf,.doc,.docx" onChange={upload} />
            {user.resumeUrl && (
              <a className="mt-2 inline-block text-sm text-forest" href={`http://localhost:5000${user.resumeUrl}`} target="_blank" rel="noreferrer">
                Open current resume
              </a>
            )}
          </div>
        )}
        {msg && <p className="text-sm text-forest">{msg}</p>}
        {err && <p className="text-sm text-red-700">{err}</p>}
        <button className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}
