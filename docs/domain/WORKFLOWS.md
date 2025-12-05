# Workflows

This document describes **how users interact with the system**, independent of UI framework.

---

## Worker Workflow

### Main View (Mobile-first)

Sections:

- **In Progress** – at most one active ticket.
- **Today** – TODO + paused tickets scheduled for today.
- **Worker Done** – tickets completed by worker, awaiting zootechnician review.

Worker does not see:

- other workers’ tasks,
- global board,
- sprint statistics.

### Allowed Actions

For a ticket assigned to the worker:

1. **Start work**

   - Preconditions:
     - ticket status in `todo` or `paused`.
   - Backend actions:
     - move target ticket → `in_progress`,
     - for any other ticket in `in_progress` for this worker:
       - move → `paused` (or `todo` depending on configuration),
     - create `TaskEvent(type="start" | "resume")`.

2. **Pause work** (optional explicit action)

   - Move `in_progress` → `paused`.
   - Create `TaskEvent(type="pause")`.

3. **Finish work (Worker Done)**

   - Preconditions:
     - ticket is `in_progress`.
     - all `required` checklist items (if any) are `done`.
   - Move ticket → `worker_done`.
   - Create `TaskEvent(type="worker_done")`.

4. **Checklist interaction**

   - Worker can toggle `done` on checklist items.
   - Changes may be logged as `TaskEvent` with `details.checklist`.

Worker cannot:

- assign tickets,
- change `zoo_done`,
- modify calendars,
- change other workers’ tasks.

---

## Zootechnician Workflow

### Board View (Desktop-first, responsive)

- Columns represent status (`todo`, `in_progress`, `worker_done`, `zoo_done`).
- Swimlanes represent:
  - each Worker,
  - plus an **UNASSIGNED** lane for tickets with `assigneeId = null`.

Actions:

- Drag cards between columns:
  - changes status (e.g. `todo → in_progress`, `worker_done → zoo_done`).
- Drag cards between swimlanes:
  - reassigns `assigneeId`.
- Move to `zoo_done`:
  - indicates final approval.
  - may create `TaskEvent(type="zoo_done")`.

### Mobile Zootechnician View

A simplified variant:

- List of workers (swimlanes collapsed).
- Selecting a worker opens a view very similar to the Worker view,  
  but with additional actions:
  - manual reassignment,
  - status overrides (where allowed).

### Calendar Management

- Global Weekly Cycle Calendar:
  - add/edit/remove CYCLE templates.
- Shift / Vacation Calendar:
  - assign workers to `date + timeSlot`,
  - mark absences.

### Sprint Management

- Trigger sprint generation for the upcoming 7 days.
- Review result:
  - tickets auto-assigned 1:1,
  - tickets left UNASSIGNED (must be manually assigned).

### Worker Management

- CRUD operations on Workers:
  - create (nickname only),
  - deactivate (no longer assignable),
  - remove (soft delete or allow only if no history).
- Generate activation links per Worker and copy them.

---

## Stakeholder Workflow (Read-only)

Stakeholders:

- open the permanent magic link,
- receive a cookie token with `role = stakeholder_readonly`,
- see the same board as Zootechnician, but:

  - no drag-and-drop,
  - no editing,
  - no calendar access,
  - no worker CRUD.

They may switch between board and simple sprint summary views (optional).

---

## Realtime Behaviour

The system must behave as **live** for:

- Workers (tasks/status assigned/changed by zootechnician),
- Zootechnician and Stakeholders (updates from workers).

Abstract rules:

- When a ticket is changed by **any** actor, all relevant clients receive  
  a realtime event (see `REALTIME_PROTOCOL.md`).
- Frontend state is updated from these events without full reload.
- If a client tries to update a stale ticket version, the backend rejects  
  the update and sends the latest ticket state.

---

## "Yesterday" Worker History View (Optional)

For analytics and supervision, Zootechnician can open a **per-worker daily timeline**:

- choose `workerId` + `date`,
- see a timeline (mini-Gantt) based on `TaskEvent` records:
  - contiguous `in_progress` segments per ticket,
  - pauses and resumes,
  - total active time.

This view is **informational only**, not an HR time-tracking tool.
