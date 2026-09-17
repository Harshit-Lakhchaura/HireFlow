import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const demos = [
  { label: "Seeker", email: "seeker@hireflow.dev", password: "Seeker@123" },
  { label: "Recruiter", email: "recruiter@hireflow.dev", password: "Recruiter@123" },
  { label: "Admin", email: "admin@hireflow.dev", password: "Admin@123" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      navigate(user.role === "admin" ? "/admin" : user.role === "recruiter" ? "/recruiter/jobs" : "/jobs");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">Welcome back</h1>
      <form className="card mt-6 space-y-4 p-6" onSubmit={submit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full">Log in</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {demos.map((d) => (
          <button key={d.email} className="btn-ghost text-xs" onClick={() => { setEmail(d.email); setPassword(d.password); }}>
            {d.label}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-ink/60">
        New here? <Link className="font-semibold text-forest" to="/register">Create an account</Link>
      </p>
    </div>
  );
}
