# Full Stack Application — NestJS + React Admin Panel

A modular, secure, and production-ready full-stack web application using **NestJS** for the backend and **React + Vite** for the frontend.

---

## 📦 Tech Stack

### 🛠 Backend (BE - NestJS)

- NestJS (modular architecture)
- MongoDB (Mongoose)
- JWT Authentication (Access & Refresh tokens)
- Swagger / OpenAPI docs
- Role-based access (admin, user)
- Security: Helmet, rate limiting, CORS, input validation
- Health checks & Prometheus metrics
- Audit logging

### 🎨 Frontend (FE - React + Vite)

- React 18 + TypeScript
- Vite
- TailwindCSS + ShadCN UI
- Zustand (state management)
- React Hook Form + Zod
- TanStack React Query (v5)
- Axios + Orval (OpenAPI client typing)
- JWT handling (auth + refresh)
- Fully responsive admin dashboard

---

## ⚙️ Project Structure

```
/
├── BE/         # NestJS Backend API
├── FE/         # React Admin Frontend
├── .env.example
├── .gitignore
├── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd <your-project-folder>
```

---

### 2. Setup Environment Files

```bash
cp .env.example .env
```

> Edit `.env` values as needed for your local dev environment.

---

### 3. Run the Backend (NestJS API)

```bash
cd BE
pnpm install
pnpm run start:dev
```

- Backend API: `http://localhost:5000`
- Swagger docs: `http://localhost:5000/api/docs`

---

### 4. Run the Frontend (React + Vite)

```bash
cd ../FE
pnpm install
pnpm run dev
```

- Admin Panel: `http://localhost:3000`

Make sure your `.env` in FE includes:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📄 Example `.env.example`

```dotenv
# === Backend ===
NODE_ENV=development
PORT=5000
CORS_ORIGINS=http://localhost:3000
THROTTLE_TTL=60
THROTTLE_LIMIT=100
MONGODB_URI=mongodb://localhost:27017/nestapp
JWT_SECRET=your_jwt_secret_which_is_at_least_32_characters_long
JWT_REFRESH_SECRET=your_refresh_jwt_secret_which_is_at_least_32_characters_long
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# === Frontend ===
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📦 Scripts

### Backend

| Command      | Description               |
| ------------ | ------------------------- |
| `start:dev`  | Run in development mode   |
| `start:prod` | Run compiled backend      |
| `build`      | Compile NestJS app        |
| `test`       | Run tests (Jest)          |
| `docker:up`  | Spin up Docker containers |

### Frontend

| Command | Description              |
| ------- | ------------------------ |
| `dev`   | Run Vite dev server      |
| `build` | Build static site        |
| `serve` | Preview production build |

---

## 🐳 Optional: Docker (Backend)

```bash
cd BE
pnpm run docker:build
pnpm run docker:up
```

> Docker Compose sets up MongoDB + Nest API

---

## 🧪 Features Overview

- Auth: register, login, logout, refresh token
- User Management: create/edit/delete users
- Filters, search, pagination
- Dashboard stats (active/inactive users)
- Admin-only protected routes

---

## 📝 License

MIT
