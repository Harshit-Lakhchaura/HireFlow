import { useEffect, useState } from "react";
import api from "../api/client";

export default function Company() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    size: "11-50",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/companies/me").then((res) => {
      if (res.data.company) {
        const c = res.data.company;
        setForm({
          name: c.name || "",
          description: c.description || "",
          website: c.website || "",
          location: c.location || "",
          size: c.size || "11-50",
        });
      }
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.put("/companies/me", form);
    setMsg("Company saved. You can post jobs now.");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-4xl">Company profile</h1>
      <form className="card mt-6 space-y-4 p-6" onSubmit={save}>
        <input placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <textarea rows="4" placeholder="About the company" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}>
          {["1-10", "11-50", "51-200", "201-500", "500+"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {msg && <p className="text-sm text-forest">{msg}</p>}
        <button className="btn-primary">Save company</button>
      </form>
    </div>
  );
}
