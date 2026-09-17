import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm font-medium ${isActive ? "bg-ink text-white" : "text-ink/70 hover:text-ink"}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          Hire<span className="text-amber">Flow</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/jobs" className={linkClass}>
            Jobs
          </NavLink>
          {user?.role === "seeker" && (
            <>
              <NavLink to="/saved" className={linkClass}>Saved</NavLink>
              <NavLink to="/applications" className={linkClass}>Applications</NavLink>
            </>
          )}
          {user?.role === "recruiter" && (
            <>
              <NavLink to="/recruiter/jobs" className={linkClass}>My jobs</NavLink>
              <NavLink to="/recruiter/company" className={linkClass}>Company</NavLink>
            </>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-ink/70">
                {user.name}
              </Link>
              <button
                className="btn-ghost"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>
        <button className="btn-ghost md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          Menu
        </button>
      </div>
      {open && (
        <div className="space-y-2 border-t border-ink/5 px-4 py-3 md:hidden">
          <Link className="block py-1" to="/jobs" onClick={() => setOpen(false)}>Jobs</Link>
          {user ? (
            <>
              <Link className="block py-1" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
              {user.role === "seeker" && (
                <>
                  <Link className="block py-1" to="/saved" onClick={() => setOpen(false)}>Saved</Link>
                  <Link className="block py-1" to="/applications" onClick={() => setOpen(false)}>Applications</Link>
                </>
              )}
              {user.role === "recruiter" && (
                <>
                  <Link className="block py-1" to="/recruiter/jobs" onClick={() => setOpen(false)}>My jobs</Link>
                  <Link className="block py-1" to="/recruiter/company" onClick={() => setOpen(false)}>Company</Link>
                </>
              )}
              {user.role === "admin" && (
                <Link className="block py-1" to="/admin" onClick={() => setOpen(false)}>Admin</Link>
              )}
              <button
                className="btn-ghost w-full"
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn-ghost flex-1" onClick={() => setOpen(false)}>Log in</Link>
              <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>Join</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
