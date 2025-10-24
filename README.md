# Books CRUD — Mini Project

This project implements a full CRUD flow for a single entity **Books** (title, author, genre, year, rating).
It includes a **Node.js + Express** backend with **SQLite** migrations and a simple SPA frontend (HTML/CSS/JS).

> Note: The project is prepared for quick local usage (SQLite). If you want to deploy with PostgreSQL on Render, see the **Deploy** section below.

## Structure
```
/backend    # Express API, migrations, runs on port 3000
/frontend   # Static SPA (served by backend)
```

## Run locally
1. Install Node (16+). In a terminal:
```bash
cd backend
npm install
npm run migrate
npm start
```
2. Open `http://localhost:3000` in your browser.

## API Endpoints
- `GET /api/books` — list books (200)
- `GET /api/books/:id` — get book (200) or (404)
- `POST /api/books` — create (201) or (400)
  - body: `{ title, author, genre, year, rating }`
- `PUT /api/books/:id` — update (200) or (400/404)
- `DELETE /api/books/:id` — delete (204) or (404)

Validation errors return `400` with `errors` array.

## Switching to PostgreSQL (for Render)
1. Create a PostgreSQL database on your host (Render, Railway, etc.).
2. Set environment variable `DATABASE_URL` or configure your provider to set `DB_FILE` (if using SQLite choose not to).
3. Use the provided SQL in `backend/migrations/001_create_books.sql` as Postgres-compatible (it is). Run migrations using psql or adapt the `run_migrations.js` to run SQL on Postgres (simple option: run the SQL file via psql).

## Deploy suggestions
- Backend: Render (create a Web Service, build command `npm install`, start `npm start`). Ensure to run `npm run migrate` on deploy or add migration step.
- Frontend: you can serve via the backend (current config) or host static on Vercel/Netlify and point API to backend URL.

## Files included
- backend/package.json, server.js, run_migrations.js, migrations/001_create_books.sql
- frontend/index.html, style.css, app.js
- README

Enjoy — if you want, I can also:
- Convert migrations to Flyway or Sequelize migrations for PostgreSQL.
- Add seed data and automated deploy files (`render.yaml`, `vercel.json`).
- Create a git repo with commit history and PR-ready structure.
- Produce a PostgreSQL-ready backend instead of SQLite.


## PostgreSQL (Render) migrations & seeding

To run PostgreSQL migrations locally or on your host, set `DATABASE_URL` env var (Postgres connection string).

Example (macOS / Linux):
```bash
export DATABASE_URL=postgres://user:password@localhost:5432/booksdb
cd backend
npm install
npm run migrate:pg    # runs SQL files in backend/migrations
npm run seed:pg       # inserts seed data
node server.js
```

On **Render**, you can configure the service to run `npm run migrate:pg` before `npm start` (see `render.yaml` included).
