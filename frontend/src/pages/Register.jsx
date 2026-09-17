import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "seeker" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await register(form);
      navigate(user.role === "recruiter" ? "/recruiter/company" : "/jobs");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Join HireFlow</h1>
      <form className="card mt-6 space-y-4 p-6" onSubmit={submit}>
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="seeker">I am looking for a job</option>
          <option value="recruiter">I am hiring</option>
        </select>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full">Create account</button>
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Already registered? <Link className="font-semibold text-forest" to="/login">Log in</Link>
      </p>
    </div>
  );
}
