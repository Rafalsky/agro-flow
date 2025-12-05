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
```

Channels:

- `worker:<workerId>` – events relevant to that worker’s tasks.
- `board:zoo` – events relevant to the zootechnician board.
- `board:readonly` – same events, but used by stakeholder sessions.

Server MAY ignore channel filtering for simplicity on small deployments and just broadcast to all connected clients of a given role.

### Event Envelope

All events sent from server to client must conform to this envelope:

```json
{
  "type": "task.updated",
  "timestamp": "2025-12-05T10:15:00Z",
  "payload": { ... }
}
```

Fields:

- `type`: string – event type identifier.
- `timestamp`: ISO-8601 – when the event was generated.
- `payload`: object – event-specific data.

### Event Types

#### 1. task.updated

Sent whenever a ticket is created or updated.

```json
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
```

Clients:

- update local ticket cache,
- respect the version (higher version wins).

#### 2. task.removed (optional)

If tickets can be deleted/archived:

```json
{
  "type": "task.removed",
  "timestamp": "...",
  "payload": {
    "ticketId": "t123"
  }
}
```

#### 3. board.refreshHint (optional)

Backend may emit a hint that the client should refetch a larger piece of board state
(e.g. after sprint generation).

```json
{
  "type": "board.refreshHint",
  "timestamp": "...",
  "payload": {
    "since": "2025-12-05T10:00:00Z"
  }
}
```

Frontend action:

- perform `GET /api/board` (or partial fetch) and reconcile state.

#### 4. worker.statsUpdated (optional)

For dashboards and progress indicators:

```json
{
  "type": "worker.statsUpdated",
  "timestamp": "...",
  "payload": {
    "workerId": "w123",
    "sprintId": "2025-48",
    "remainingStoryPoints": 12
  }
}
```

### Client → Server Messages (WS only)

Minimal message set:

```json
{
  "action": "subscribe",
  "channels": ["worker:w123"]
}
```

Future extensions may include:

- unsubscribe,
- ping/pong (or rely on underlying WS implementation).

### Polling Fallback

If WebSockets are not available, the frontend may:

1. Call periodically:
   `GET /api/events?since=<ISO-8601>`

2. Receive an array of events in the same envelope format:

```json
[
  {
    "type": "task.updated",
    "timestamp": "...",
    "payload": { ... }
  },
  ...
]
```

3. Apply events using the same handler logic as in WS mode.

This keeps the protocol agnostic to transport and allows simple deployments (e.g. PHP + MySQL) to emulate realtime behaviour.
