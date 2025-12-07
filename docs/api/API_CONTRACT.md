# API Contract (HTTP/REST)

This document describes the **framework-agnostic** HTTP API for the Farm Task System.

Base path (example): `/api`

All endpoints return/accept JSON.  
Authentication is via **cookie token** set by activation/magic link flows.

---

## Auth / Session

### `GET /api/me`

Returns information about the current authenticated user.

- Response 200:

```json
{
  "userId": "u123",
  "role": "worker" | "zootechnician" | "stakeholder_readonly",
  "displayName": "Kasia",
  "workerId": "w123"     // only for role = worker
}

401 if no valid cookie token.

Worker-facing Endpoints
GET /api/me/tasks

Returns tasks relevant for the current worker (today + active).

Auth: role = worker.

Query parameters (optional):

date (ISO date, default = today).

Response 200:
{
  "date": "2025-12-05",
  "inProgress": [Ticket],
  "today": [Ticket],
  "workerDone": [Ticket]
}
Ticket uses a consistent DTO, e.g.:

{
  "id": "t123",
  "title": "Clean farrowing pens",
  "type": "CYCLE_INSTANCE",
  "status": "in_progress",
  "plannedDate": "2025-12-05",
  "timeSlot": "morning",
  "assigneeId": "w123",
  "storyPoints": 3,
  "checklist": [...],
  "version": 4
}


POST /api/tasks/:id/start

Starts work on a task for the current worker.

Auth: role = worker.

Body:
{
  "clientVersion": 4
}

Response:

200 with updated ticket (and possibly other affected tickets for this worker).

409 if clientVersion < serverVersion.

POST /api/tasks/:id/pause (optional)

Pauses current task.

POST /api/tasks/:id/worker-done

Marks task as worker_done.

Preconditions enforced server-side:

task is assigned to current worker,

required checklist items are completed.

Body:

{
  "clientVersion": 5,
  "data": { "farrowing": { "alive": 10, "dead": 5 } }  // optional, type-specific
}


Zootechnician Board and Tickets
GET /api/board

Returns full board state for the current sprint.

Auth: role = zootechnician | stakeholder_readonly.

Query params:

sprintStart (optional, default = current sprint).

Response 200:

{
  "sprint": {
    "startDate": "2025-12-01",
    "endDate": "2025-12-07"
  },
  "lanes": [
    {
      "laneId": "UNASSIGNED",
      "label": "Unassigned",
      "workerId": null,
      "tickets": [Ticket]
    },
    {
      "laneId": "w123",
      "label": "Kasia",
      "workerId": "w123",
      "tickets": [Ticket]
    }
  ]
}
POST /api/tasks/:id/assign

Assigns a ticket to a worker.

Auth: role = zootechnician.

Body:

{
  "clientVersion": 3,
  "assigneeId": "w123"   // null to unassign
}

POST /api/tasks/:id/status

Changes ticket status (e.g. drag-and-drop).

Auth: role = zootechnician.

Body:

{
  "clientVersion": 3,
  "status": "todo" | "in_progress" | "worker_done" | "zoo_done"
}


Server enforces business rules (e.g. single in_progress per worker).

Calendars
GET /api/calendars/cycle

Returns global weekly cycle definitions.

POST /api/calendars/cycle

Creates or updates CYCLE templates.
(Details omitted here – implementation specific, but must follow domain model in CALENDARS.md.)

GET /api/shifts?date=YYYY-MM-DD

Returns shift assignments for a specific date.

Auth: role = zootechnician.

**Alternative:** `GET /api/shifts?start=YYYY-MM-DD&end=YYYY-MM-DD` for date ranges.

POST /api/shifts/bulk

Creates/updates ShiftAssignment records in bulk.

Sprint Management
POST /api/sprint/generate

Generates tickets for the next sprint (7 days) based on both calendars.

Auth: role = zootechnician.

Body:

{
  "startDate": "2025-12-01"
}
Response: summary of created tickets and auto-assignments.

Workers CRUD
GET /api/workers

Lists workers.

POST /api/workers

Create worker:

{
  "displayName": "Kasia"
}
PATCH /api/workers/:id

Update worker (e.g. deactivate).

{
  "displayName": "Kasia K.",
  "isActive": true
}


DELETE /api/workers/:id

Soft delete or hard delete only if no references (implementation detail).

Activation Links and Magic Links
POST /api/workers/:id/activation-link

Generates or returns active activation link token.
Response contains only a token or a full URL, depending on UI design.

POST /api/zootechnician/activation-link

Same pattern for zootechnician.

POST /api/stakeholders/magic-link

Generates or rotates magic link for stakeholders.

Notes

Error handling should be standardised (e.g. JSON with code, message, details).

All endpoints are framework-agnostic – NestJS, Phoenix or any other backend
must implement the same behaviour to be compatible with farm-web.


---

