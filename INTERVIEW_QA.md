# HireFlow — interview questions and answers

Memorize the ideas, not the wording. Open the matching file while you answer.

---

## Project and product

**Q. What is HireFlow?**  
A job portal. Seekers browse/apply. Recruiters post jobs and manage applicants. Admins see platform stats and can disable users.

**Q. Why this project instead of an e-commerce clone?**  
It forces **RBAC**, **relationships** (user → company → job → application), **file upload**, **search/pagination**, and an **admin aggregation** dashboard — all typical MERN interview topics in one app.

**Q. What is the tech stack?**  
MongoDB + Mongoose, Express, React 18 (Vite, React Router, Axios, Tailwind), Node.js. JWT + bcrypt. Multer for resumes. Helmet, CORS, express-validator, express-rate-limit.

---

## MongoDB

**Q. What collections exist?**  
`users`, `companies`, `jobs`, `applications`, `savedjobs`.

**Q. How are they related?**  
Company.owner → User. Job.company → Company, Job.recruiter → User. Application.job → Job, Application.seeker → User. SavedJob.user + SavedJob.job.

**Q. Why Mongoose?**  
Schemas, validation, middleware (password hash), populate, and indexes without writing raw driver boilerplate.

**Q. Why `password: { select: false }`?**  
So `User.find()` never returns hashes by default. Login uses `.select('+password')`.

**Q. What indexes did you add and why?**  
- Unique `email` on users  
- Unique compound `{ job, seeker }` so a person cannot apply twice  
- Unique `{ user, job }` on saved jobs  
- Text index on job title/description/location and `{ type, status, createdAt }` for listing  

**Q. SQL vs NoSQL here?**  
Jobs have nested skills arrays and evolve quickly → documents fit. If I needed multi-row transactions across many entities, PostgreSQL might be better. MongoDB does support transactions; I just did not need multi-document transactions for this feature set.

**Q. What is aggregation used for?**  
Admin stats: `$group` by user role and application status, plus `countDocuments` for totals.

**Q. What is `populate`?**  
Mongoose replaces ObjectIds with documents from other collections (e.g. job → company name).

---

## Node / Express / REST

**Q. Explain a request lifecycle.**  
`server.js` → route → optional rate limit / validators → `protect` / `allow` → controller → Mongoose → JSON response. Errors go to `errorHandler`.

**Q. What is middleware?**  
A function `(req, res, next)` that runs before the controller. Examples: JSON parser, CORS, JWT, role check, Multer, validation.

**Q. How does JWT auth work?**  
Login returns a token signed with `JWT_SECRET` containing `{ id, role }`, expiry 7 days. Client stores it and Axios attaches `Bearer`. `protect` verifies the signature and loads the user.

**Q. JWT vs sessions?**  
JWT is stateless (no server session store) — good for APIs. Sessions are easier to revoke. I would add a token blocklist or short-lived access + refresh tokens in production.

**Q. How do you protect routes by role?**  
`protect` then `allow('recruiter')`. Frontend also wraps pages in `ProtectedRoute`. Backend is the real security.

**Q. How are passwords stored?**  
bcrypt hash, cost 10, in a `pre('save')` hook so updates re-hash only when password changes.

**Q. How do you handle duplicate keys?**  
Mongo error code `11000` mapped to HTTP 409 in `errorHandler`.

**Q. How does pagination work?**  
`page` and `limit` query params → `skip((page-1)*limit).limit(limit)` plus `countDocuments` for total pages.

**Q. How does search work?**  
Case-insensitive regex on title, description, location, and skills, plus exact filters for type and experience level.

**Q. How does file upload work?**  
Multer `diskStorage` into `backend/uploads`, 4MB limit, PDF/Word only. URL saved as `/uploads/filename` and served with `express.static`.

**Q. What is CORS and why?**  
The React app is on port 5173, API on 5000 — different origins. CORS allows the browser to call the API.

**Q. Why Helmet and rate limiting?**  
Helmet sets security headers. Rate limit on `/login` and `/register` slows brute force.

**Q. REST methods you used?**  
GET list/detail, POST create/apply/save, PUT update profile/job/company, PATCH application status / disable user, DELETE job.

**Q. Status codes?**  
201 create, 400 validation, 401 no/invalid token, 403 wrong role, 404 missing, 409 duplicate, 500 server.

**Q. What is `asyncHandler`?**  
Wraps async controllers so rejected promises go to `next(err)` instead of hanging.

---

## React

**Q. Why Vite?**  
Fast dev server and simple production build compared with CRA.

**Q. How is auth state shared?**  
`AuthContext`: login/register store token, `useEffect` calls `/auth/me` on refresh.

**Q. Why Context instead of Redux?**  
Auth is the main global state. Jobs are fetched per page. Redux would be extra boilerplate.

**Q. How do protected routes work?**  
`ProtectedRoute` checks `user` and optional `roles`, otherwise redirects to `/login`.

**Q. Axios interceptor?**  
Adds Bearer token on every request and unwraps API error messages.

**Q. How is the UI responsive?**  
Tailwind breakpoints (`sm`, `md`, `lg`), CSS grid for job cards, hamburger menu under `md`.

**Q. Controlled components?**  
Form inputs are React state (`value` + `onChange`), submitted with `preventDefault`.

**Q. How do you apply to a job?**  
`FormData` with cover letter + optional resume file, `multipart/form-data` POST to `/applications`.

---

## Security (they will ask)

**Q. Is localStorage JWT safe?**  
Vulnerable to XSS. Mitigations: careful rendering, CSP, httpOnly cookies in production.

**Q. Can a seeker post a job by calling the API?**  
No. `allow('recruiter')` on the server. Never trust the UI alone.

**Q. How do you stop a recruiter from seeing someone else’s applicants?**  
`jobApplications` checks `job.recruiter` equals `req.user._id` (admin bypass).

**Q. Secrets?**  
`.env` holds `JWT_SECRET` and `MONGO_URI`. `.env` is gitignored; `.env.example` is committed.

---

## Performance

**Q. How did you keep it fast?**  
Pagination so lists stay small, indexes for common filters, `select: false` on passwords, populate only needed fields, Vite for frontend, `--watch` on Node without a heavy bundler for the API.

**Q. N+1 queries?**  
Avoided by `populate` on list endpoints instead of looping extra finds.

---

## Deployment (say you would)

Frontend: Vite build → static host. Backend: Node process + MongoDB Atlas. Set `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`. Put uploads on object storage.

---

## Rapid-fire definitions

| Term | One-liner |
|---|---|
| REST | Resource URLs + HTTP verbs |
| JWT | Signed JSON claims for auth |
| bcrypt | Slow hash for passwords |
| RBAC | Permissions by role |
| CORS | Browser cross-origin rules |
| Middleware | Pipeline functions in Express |
| Populate | Join-like fetch in Mongoose |
| Aggregation | Multi-stage Mongo analytics |
| Multer | Multipart file parser |
| SPA | Client-side routing app |

---

## Live coding they might ask

- “Add a remote-only checkbox” → extra query param `type=remote` already exists; or add `isFeatured` on Job.
- “Show applicant count on cards” → `Application.aggregate` `$group` by job.
- “Forgot password” → store hashed reset token + expiry, email link, reset endpoint.
- “Refresh tokens” → short access JWT + longer refresh stored hashed in DB.
