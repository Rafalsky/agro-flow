# Tickets and History

## Ticket Entity

A `Ticket` represents a unit of work. Common fields:

- `id: string`
- `type: "CYCLE" | "NORMAL" | "EMERGENCY" | "CYCLE_INSTANCE"` (implementation choice)
- `title: string`
- `description?: string`
- `area?: string` (farm area / section)
- `plannedDate: date` (which day the work should happen)
- `timeSlot: "morning" | "evening" | "full"`
- `assigneeId?: WorkerId | null`
- `status: "todo" | "in_progress" | "paused" | "worker_done" | "zoo_done"`
- `storyPoints: number`
- `version: number` (optimistic concurrency)
- `checklist?: ChecklistItem[]` (optional, per ticket)
- `data?: JSON` (optional, type-specific data container)
- `createdAt`, `updatedAt`

### Ticket Types

- **CYCLE**
  - Template definition in the global weekly cycle calendar.
  - Not directly shown on the worker board.
  - Used to generate actual sprint tickets.

- **CYCLE_INSTANCE**
  - Concrete instance of a CYCLE template in a specific sprint/week.
  - Appears on the board like a normal task.
  - Keeps a reference to its template (e.g. `sourceCycleId`).

- **NORMAL**
  - One-off task created by the zootechnician.
  - Planned for a specific date + time slot.

- **EMERGENCY**
  - Similar to NORMAL but marked as urgent (`isEmergency = true` or `type = EMERGENCY`).
  - Visually emphasised on the board and worker view.

---

## Status Workflow

Unified status workflow for all ticket types:

1. `todo`
2. `in_progress`
3. `paused` (treated as TODO in many views, but with extra flag)
4. `worker_done`
5. `zoo_done`

Rules:

- A worker may have **at most one** `in_progress` ticket at a time.
- When a new ticket is started for a worker:
  - any existing `in_progress` ticket for that worker is automatically moved to `paused`/`todo`.
- Only workers can move their own tickets to `worker_done`.
- Only the zootechnician can move tickets to `zoo_done`.

---

## Checklist (Definition of Done)

Each ticket may optionally define a **checklist** representing a lightweight,  
per-task "Definition of Done".

`ChecklistItem` structure:

```ts
interface ChecklistItem {
  id: string;           // UUID
  label: string;        // e.g. "Refill water"
  required: boolean;    // must be checked before completion
  done: boolean;        // updated by worker
}
```

Key points:

Checklist is per ticket (not global).

Zootechnician may use presets/templates to quickly fill checklists for common tasks.

For CYCLE tasks, the template may define a default checklist copied into instances.

Worker cannot finish (worker_done) if any required item is not done.

Ticket History (TaskEvent)

History is stored in a separate entity TaskEvent:

id: string

ticketId: string

workerId?: string | null

type: "start" | "pause" | "resume" | "worker_done" | "zoo_done" | ...

timestamp: datetime

details?: JSON (optional contextual data)

Examples of details:

For farrowing-like tasks:
{
  "farrowing": {
    "alive": 10,
    "dead": 5,
    "notes": "prolonged farrowing"
  }
}

For checklist updates:
{
  "checklist": [
    { "id": "a1", "done": true },
    { "id": "b2", "done": false }
  ]
}

Ticket MAY also store a summarised data JSON field with selected information
(e.g. final farrowing counts), but TaskEvent.details is the primary immutable history.

Concurrency and Conflicts

Each ticket has a numeric version.

Any update must send clientVersion.

Backend behaviour:

If clientVersion < serverVersion → reject operation, return current ticket.

If clientVersion === serverVersion → accept update, increment version.

Realtime events always include the new version.

This prevents conflicting updates when both worker and zootechnician act on the same ticket.


---


