# Farm Task System – Domain Overview

## Purpose

The system supports daily work organisation on a pig farm. It is **not** a herd management or HR system.  
Main goals:

- Plan and execute a **weekly cycle** of recurring tasks.
- Handle **one-off** and **emergency** tasks.
- Provide a **kanban board** for the zootechnician (planner/manager).
- Provide a **minimal mobile view** for workers – focused on "what I do today".
- Provide **read-only insight** for stakeholders (owner/director) via a stable magic link.
- Avoid storing PII – workers are identified by nickname only.

The system is designed for **a single farm** (bespoke, single tenant).

---

## Core Concepts

### Roles

- **Worker**
  - Performs physical tasks on the farm.
  - Sees only their own tasks.
  - Works in a mobile-first list view (Today / In Progress / Worker Done).

- **Zootechnician**
  - Plans and supervises all work.
  - Owns calendars, sprint generation, assignments and final approval.
  - Works primarily on a board view (kanban with swimlanes).

- **Stakeholder (Read-only)**
  - Farm owner / director / other stakeholders.
  - See the same board as the zootechnician, but in read-only mode.
  - Access via permanent **magic link** (no login).

---

### Tickets

A **ticket** represents a unit of work to be performed on the farm.

Ticket types:

- `CYCLE` – recurring task defined in the **global weekly cycle calendar**.
- `NORMAL` – ad-hoc single task.
- `EMERGENCY` – urgent task (flagged on the board, higher visual priority).

Shared properties:

- `id`
- `type` (`CYCLE | NORMAL | EMERGENCY` or `CYCLE_INSTANCE` depending on implementation)
- `title`, `description`
- `area` (optional: farm area / section)
- `plannedDate` and `timeSlot` (`morning | evening | full`)
- `assignee` (Worker id or null → UNASSIGNED)
- `status` (`todo | in_progress | paused | worker_done | zoo_done`)
- `storyPoints` (effort estimate)
- optional `checklist` (quality definition, stored as JSON per ticket)
- optional `data` (generic JSON container for type-specific data, e.g. farrowing metrics)

Each ticket has a **version** field (integer) used for optimistic concurrency.

---

### Calendars

There are two calendars:

1. **Global Weekly Cycle Calendar**
   - Describes **what tasks happen every week** (CYCLE tasks).
   - Defines day of week, time slot and optional area.
   - Used to generate sprint tickets at the start of each week.

2. **Shift / Vacation Calendar**
   - Describes **who works when**.
   - For each day and time slot specifies which worker is on duty (or on leave).
   - Used to auto-assign generated CYCLE tickets where there is a 1:1 match.

A **sprint** is always 7 days and is derived from these two calendars.

---

### History and Events

Task history is stored as **immutable events**, e.g.:

- `start`
- `pause`
- `resume`
- `worker_done`
- `zoo_done`

Each event contains optional JSON `details` used for contextual data  
(e.g. farrowing counts, checklist changes).

This enables:

- per-ticket timeline,
- "yesterday view" for a worker (mini-Gantt),
- simple analytics for recurring tasks.

---

## Non-Goals

The system intentionally does **not**:

- manage individual animals as first-class entities (no full herd book),
- record detailed time tracking for payroll,
- handle multiple farms / tenants,
- provide complex BI dashboards – only simple operational views.

The focus is **practical daily work organisation** for a single farm,  
with minimum friction for workers and the zootechnician.
