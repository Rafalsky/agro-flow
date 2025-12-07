# Implementation Plan

## Milestone 1: Project Skeleton & Infra
- [x] Initialize NestJS project in `api/`
- [x] Initialize React (Vite) project in `web/`
- [x] Setup Docker Compose (`db`, `api`, `web`)
  - [x] Ensure the full application stack runs seamlessly via `docker-compose up`
- [x] Configure Environment Variables (`.env.example`)
  - [x] Implement support for `production`, `development`, and `test` environments via env vars
- [x] Set up global prefix `/api` and healthchecks

## Milestone 2: Database & Core Domain Entities
- [x] Design Schema (Prisma/TypeORM): Users, Workers, Tickets, Calendars
- [x] Implement initial migrations
- [x] Implement `User` / `Worker` entities and seeds

## Milestone 3: Authentication
- [x] Implement Cookie-based Auth Guard
- [~] Implement Activation Link generation and handling
- [~] Implement Magic Link handling for Stakeholders
- [~] `GET /api/me` endpoint

## Milestone 4: Calendars & Sprint Logic (Backend)
- [x] Implement `GlobalCycle` CRUD
- [x] Implement `ShiftAssignment` CRUD
- [x] Implement Sprint Generation Logic (Cycle -> Instances + Auto-assign)

## Milestone 5: Tickets & Board State (Backend)
- [x] Implement Ticket CRUD (Create, Update Status, Edit)
- [~] Implement `GET /api/board` (Zootechnician view)
- [~] Implement `GET /api/me/tasks` (Worker view)
- [ ] Implement Optimistic Locking (versions)

## Milestone 6: Realtime Gateway
- [ ] Set up Gateway (WebSocket or SSE)
- [ ] Implement Event Envelope (`task.updated`, etc.)
- [ ] Emit events on ticket mutations

## Milestone 7: Frontend - Core & Worker App
- [ ] Implement Design System (Glassmorphism, Tokens, tailwind.config.js?)
- [ ] Setup Layouts (Mobile vs Desktop)
- [ ] Implement Auth Context (Login via token URL handles)
- [ ] Implement Worker "Today" View
- [ ] Implement Ticket Card & Status Transitions

## Milestone 8: Frontend - Zootechnician Board
- [ ] Implement Kanban Board (Drag & Drop)
- [ ] Implement Swimlanes (Workers, Unassigned)
- [ ] Implement Sidebar/Modals for Ticket Creation

## Milestone 9: Frontend - Calendars & Management
- [ ] Implement Cycle Calendar Editor
- [ ] Implement Shift/Vacation Editor
- [ ] Implement Worker Management Screen

## Milestone 10: E2E & Verification
- [ ] Add Docker-based E2E test suite
- [ ] Verify full "Worker starts task -> Zoo sees update" flow
- [ ] Final polishing
