export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/10 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">HireFlow</p>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            A MERN job portal with roles, applications, search, and recruiter tools.
          </p>
        </div>
        <div className="text-sm text-white/70">
          <p className="font-semibold text-white">For interviews</p>
          <p className="mt-2">JWT auth · REST APIs · MongoDB indexes · role-based access · file uploads</p>
        </div>
        <div className="text-sm text-white/70">
          <p>© {new Date().getFullYear()} HireFlow</p>
          <p className="mt-2">Built for resume demos. Demo accounts are in the README.</p>
        </div>
      </div>
    </footer>
  );
}
