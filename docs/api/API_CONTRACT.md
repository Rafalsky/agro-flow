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

GET /api/calendars/shifts?sprintStart=YYYY-MM-DD

Returns shift / vacation assignments for the sprint.

POST /api/calendars/shifts

Creates/updates ShiftAssignment records.

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

### `docs/api/REALTIME_PROTOCOL.md`

```md
# Realtime Protocol (Framework Agnostic)

This document defines a **transport-agnostic** event protocol used between frontend and backend.

The transport may be:

- WebSocket (`wss://.../api/realtime`), or
- Server-Sent Events (`/api/events`), or
- HTTP polling (`GET /api/events?since=...`),

as long as messages follow this format.

---

## Connection

### WebSocket example

1. Client opens `wss://host/api/realtime`.
2. Server authenticates using the cookie token associated with the HTTP upgrade request.
3. Client sends a `subscribe` message indicating interest.

Message format (JSON):

```json
{
  "action": "subscribe",
  "channels": ["worker:w123", "board:zoo"]
}
Channels:

worker:<workerId> – events relevant to that worker’s tasks.

board:zoo – events relevant to the zootechnician board.

board:readonly – same events, but used by stakeholder sessions.

Server MAY ignore channel filtering for simplicity on small deployments and just broadcast to all connected clients of a given role.

Event Envelope

All events sent from server to client must conform to this envelope:

{
  "type": "task.updated",
  "timestamp": "2025-12-05T10:15:00Z",
  "payload": { ... }
}


Fields:

type: string – event type identifier.

timestamp: ISO-8601 – when the event was generated.

payload: object – event-specific data.

Event Types
1. task.updated

Sent whenever a ticket is created or updated.

{
  "type": "task.updated",
  "timestamp": "...",
  "payload": {
    "ticket": {
      "id": "t123",
      "version": 7,
      "status": "in_progress",
      "assigneeId": "w123",
      "plannedDate": "2025-12-05",
      "timeSlot": "morning",
      "storyPoints": 3,
      "checklist": [...],
      "data": { ... }
    }
  }
}
Clients:

update local ticket cache,

respect the version (higher version wins).

2. task.removed (optional)

If tickets can be deleted/archived:


{
  "type": "task.removed",
  "timestamp": "...",
  "payload": {
    "ticketId": "t123"
  }
}


3. board.refreshHint (optional)

Backend may emit a hint that the client should refetch a larger piece of board state
(e.g. after sprint generation).

{
  "type": "board.refreshHint",
  "timestamp": "...",
  "payload": {
    "since": "2025-12-05T10:00:00Z"
  }
}


Frontend action:

perform GET /api/board (or partial fetch) and reconcile state.

4. worker.statsUpdated (optional)

For dashboards and progress indicators:

{
  "type": "worker.statsUpdated",
  "timestamp": "...",
  "payload": {
    "workerId": "w123",
    "sprintId": "2025-48",
    "remainingStoryPoints": 12
  }
}


Client → Server Messages (WS only)

Minimal message set:

{
  "action": "subscribe",
  "channels": ["worker:w123"]
}
Future extensions may include:

unsubscribe,

ping/pong (or rely on underlying WS implementation).

Polling Fallback

If WebSockets are not available, the frontend may:

Call periodically:

GET /api/events?since=<ISO-8601>

Receive an array of events in the same envelope format:

[
  {
    "type": "task.updated",
    "timestamp": "...",
    "payload": { ... }
  },
  ...
]


Apply events using the same handler logic as in WS mode.

This keeps the protocol agnostic to transport and allows simple deployments (e.g. PHP + MySQL) to emulate realtime behaviour.