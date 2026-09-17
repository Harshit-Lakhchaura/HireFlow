import { useEffect, useState } from "react";
import api from "../api/client";

export default function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [s, u] = await Promise.all([api.get("/admin/stats"), api.get("/admin/users")]);
    setStats(s.data);
    setUsers(u.data.users);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle`);
    load();
  };

  if (!stats) return <p className="py-20 text-center">Loading admin…</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Admin overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Users", stats.users],
          ["Jobs", stats.jobs],
          ["Applications", stats.applications],
          ["Companies", stats.companies],
        ].map(([label, value]) => (
          <div key={label} className="card p-5">
            <p className="text-sm text-ink/50">{label}</p>
            <p className="font-display text-4xl">{value}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">Users</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/50">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink/5">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{u.isActive ? "active" : "disabled"}</td>
                <td>
                  {u.role !== "admin" && (
                    <button className="btn-ghost" onClick={() => toggle(u._id)}>
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
