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

