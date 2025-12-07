# First Usage Guide

## Prerequisites
- Docker & Docker Compose
- Node.js (for local development tooling, optional if running fully in docker)

## Starting the Application
1. **Start Containers**:
   ```bash
   docker compose up -d
   ```
   This starts:
   - **Postgres Database** (port 5432)
   - **NestJS Backend API** (port 3000)
   - **React Frontend** (port 5173)

2. **Seeding Data** (First Run Only):
   The application requires initial users to be present. Run:
   ```bash
   docker compose exec api npm run seed
   ```
   This creates:
   - **Zootechnician** (Magic Link: `dev-zootech`)
   - **Worker** (Magic Link: `dev-worker`)

## Logging In
Navigate to [http://localhost:5173/login](http://localhost:5173/login).

You will see two "Dev Login" buttons:
- **Login as Worker**: Redirects to the Worker Dashboard (`/`).
- **Login as Zootechnician**: Redirects to the Kanban Board (`/board`).

These buttons use the pre-seeded Magic Links (`dev-worker` and `dev-zootech`).

## Verification Steps
1. **Zootechnician View**:
   - Login as Zootechnician.
   - Go to **Workers** sidebar tab. You should see "Jan Kowalski".
   - Go to **Cycles**. You should see empty list (create one to test).
   - Go to **Board**. You should see the Kanban board.

2. **Worker View**:
   - Open Incognito window or logout.
   - Login as Worker.
   - You should see "Today's Tasks" (likely empty initially).

## Troubleshooting
- **Access Denied**: Ensure you ran the `seed` command. If cookies are stuck, clear them or use Incognito.
- **Backend Error**: Check logs with `docker compose logs -f api`.
