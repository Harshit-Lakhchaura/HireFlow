import { Link } from "react-router-dom";

export function formatSalary(min, max) {
  if (!min && !max) return "Salary not listed";
  const fmt = (n) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `₹${n.toLocaleString("en-IN")}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  return fmt(min || max);
}

export default function JobCard({ job }) {
  return (
    <article className="card flex h-full flex-col p-5 transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-forest">
            {job.company?.name || "Company"}
          </p>
          <h3 className="mt-1 font-display text-xl leading-tight">{job.title}</h3>
        </div>
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold capitalize">{job.type}</span>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink/70">{job.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(job.skills || []).slice(0, 4).map((s) => (
          <span key={s} className="rounded-full bg-paper px-2 py-1 text-xs">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink/60">{job.location}</span>
        <span className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
      </div>
      <Link to={`/jobs/${job._id}`} className="btn-primary mt-5 w-full">
        View role
      </Link>
    </article>
  );
}
