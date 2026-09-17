# How I built HireFlow (say this in interviews)

Speak in first person. Understand every bullet. If you used Cursor/AI as an assistant, you can say you used it for scaffolding but **you own the architecture and can explain every file**.

## 1. Problem I picked

I wanted one project that shows the whole MERN stack, not a todo list. A job portal has three actors (seeker, recruiter, admin), so it naturally needs auth, roles, CRUD, search, and file upload.

## 2. Architecture I chose

- **Client–server**: React SPA talks to an Express REST API over JSON.
- **Database**: MongoDB with Mongoose because jobs/applications are document-shaped and I wanted fast iteration.
- **Auth**: JWT in `localStorage`, sent as `Authorization: Bearer`.
- **Passwords**: hashed with bcrypt in a Mongoose `pre('save')` hook.
- **Structure**: `models → controllers → routes → middleware` (MVC-style).

I split frontend and backend so they can be deployed separately (Vercel + Render, for example).

## 3. Order I implemented (this is the honest build sequence)

1. Designed collections on paper: User, Company, Job, Application, SavedJob.
2. Wired Express + Mongo connection + `/api/health`.
3. Auth first: register, login, `protect` middleware, `allow(roles)`.
4. Company profile (recruiters cannot post jobs until a company exists).
5. Job CRUD + list with query filters and skip/limit pagination.
6. Apply flow with Multer resume upload and unique `(job, seeker)` index.
7. Recruiter pipeline: patch application status.
8. Admin stats using MongoDB `$group` aggregations.
9. React: AuthContext, Axios interceptor, React Router, protected pages.
10. Responsive layout (mobile menu, grid cards) and seed data for demos.

## 4. Important files I should be able to open live

- `backend/src/server.js` — app bootstrap, CORS, helmet, static `/uploads`
- `backend/src/middleware/auth.js` — JWT verify + RBAC
- `backend/src/models/*.js` — schemas, indexes, password hashing
- `backend/src/controllers/jobController.js` — search + pagination
- `frontend/src/context/AuthContext.jsx` — session restore from token
- `frontend/src/api/client.js` — Axios base URL and Bearer header

## 5. Trade-offs I can defend

- **JWT in localStorage** vs httpOnly cookie: simpler SPA demo; cookies are safer against XSS. I would move to cookies in production.
- **Regex search** vs Atlas Search / `$text`: regex is enough for a demo dataset; I still added a text index for a production-style upgrade path.
- **No Redux**: Auth + server state via Context and local component state. Redux would help if many screens shared complex client state.
- **Disk uploads**: Multer to `/uploads`. Production would use S3 + signed URLs.

## 6. If they ask “did you copy this?”

Answer: “I built it as a resume project with a clear spec: MERN, RBAC, search, uploads, admin stats. I can walk through any endpoint and change a feature if you want.” Then actually change a label or add a filter if they ask.

## 7. 60-second pitch

“HireFlow is a job marketplace. Users sign up as seekers or recruiters. JWT protects APIs. Seekers search jobs with filters and pagination, upload a resume, and apply. Recruiters manage a company, post jobs, and move candidates through statuses. Admins see aggregated counts and can disable accounts. The UI is a Vite React app with protected routes and a responsive layout.”
