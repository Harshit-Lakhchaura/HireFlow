# HireFlow

Full-stack **MERN** job portal for your resume: seekers apply, recruiters hire, admins oversee the marketplace.

- **MongoDB** — users, companies, jobs, applications, saved jobs, indexes, aggregation
- **Express** — REST APIs, JWT auth, role middleware, validation, rate limiting, file uploads
- **React (Vite)** — responsive UI, protected routes, search/filter/pagination, dashboards
- **Node.js** — bcrypt passwords, environment config, seed script

## Run locally

You need **Node.js 18+**. If MongoDB is not installed, the API starts an **in-memory database** and auto-loads demo users (data resets when you stop the server). For a real/persistent DB, install MongoDB or run:

```bash
docker compose up -d
```

Then set `MONGO_URI=mongodb://127.0.0.1:27017/hireflow` and `npm run seed`.

### One command (from the project root)

```bash
npm install
npm run install:all
npm run dev
```

API: http://localhost:5000/api/health  
App: http://localhost:5173

### Backend only

```bash
cd backend
npm install
npm run dev
```

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

## Demo logins

| Role | Email | Password |
|---|---|---|
| Seeker | seeker@hireflow.dev | Seeker@123 |
| Recruiter | recruiter@hireflow.dev | Recruiter@123 |
| Admin | admin@hireflow.dev | Admin@123 |

## Deploy on Vercel (required for the live login)

Vercel only hosts the React app unless the **API + MongoDB Atlas** are configured. Login fails with **Network Error** if the browser still calls `localhost:5000`.

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Database Access: add a user. Network Access: allow `0.0.0.0/0`.
3. Copy the connection string, e.g. `mongodb+srv://USER:PASS@cluster.mongodb.net/hireflow`.
4. In Vercel → Project → Settings:
   - **Root Directory** must be empty (repo root), not `frontend`.
5. In Vercel → Settings → Environment Variables (Production):
   - `MONGO_URI` = Atlas URI
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = `https://hire-flow-green-seven.vercel.app`
6. Redeploy. Open `/api/health` on the same domain — it should return `{ "ok": true }`.

## What to show in an interview

1. Home + job search (filters, pagination)
2. Login as **seeker** → apply with resume → saved jobs → applications tracker
3. Login as **recruiter** → company profile → post job → change applicant status
4. Login as **admin** → stats → disable a user
5. Walk API flow: `Authorization: Bearer <jwt>` on protected routes

