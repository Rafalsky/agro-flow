# Calendars and Sprint Generation

## Overview

The system has **two calendars**:

1. **Global Weekly Cycle Calendar** – defines WHAT should happen every week (CYCLE tasks).
2. **Shift / Vacation Calendar (Sprint Calendar)** – defines WHO works WHEN.

A **sprint** is always 7 days (e.g. Monday–Sunday) and is derived from these calendars.

---

## Global Weekly Cycle Calendar

Purpose: define the recurring farm routine.

Each entry (CYCLE template) contains:

- `cycleId`
- `title`, `description`
- `area` (optional)
- `dayOfWeek` (`0–6` or `Mon–Sun`)
- `timeSlot` (`morning | evening | full`)
- `storyPoints`
- `checklist` preset (optional)
- `data` preset (JSON for type-specific use cases) (optional)

The calendar is edited only by the **Zootechnician**.

---

## Shift / Vacation Calendar

Purpose: plan workers’ shifts and absences for a specific sprint.

Entity `ShiftAssignment`:

- `id`
- `date`
- `timeSlot` (`morning | evening`)
- `workerId`
- `status: "working" | "on_leave"`

Multiple workers may be assigned to the same `date + timeSlot`.  
A worker may have at most one status per `date + timeSlot`.

Again, edited only by the Zootechnician.

---

## Sprint Generation

At the start of a sprint (or when explicitly triggered by the zootechnician),  
the system generates tickets for that 7-day window.

Algorithm:

1. **Instantiate CYCLE templates**

   For each `CYCLE` template in the global calendar:

   - For the upcoming sprint’s dates:
     - If `dayOfWeek` matches a day in the sprint:
       - create a new sprint ticket (`CYCLE_INSTANCE` or `NORMAL` with `sourceCycleId`):
         - `plannedDate` = matched date,
         - `timeSlot` = template’s `timeSlot`,
         - `area`, `storyPoints`, `checklist`, `data` copied from template.

2. **Auto-assignment from Shift Calendar**

   For each generated CYCLE ticket:

   - Find workers with `ShiftAssignment.status = "working"`  
     for `plannedDate + timeSlot` (and optionally matching `area` if modelled).
   - Cases:
     - Exactly 1 matching worker → `assigneeId = workerId`.
     - 0 or >1 matching workers → `assigneeId = null` (UNASSIGNED swimlane).

3. **NORMAL / EMERGENCY tickets**

   - Created manually by Zootechnician at any time.
   - May reuse the same auto-assignment logic based on `plannedDate + timeSlot`.

UNASSIGNED swimlane on the board contains:

- tickets where auto-assignment could not find a unique worker,
- manually created tickets without assignee.

---

## Behaviour When Calendars Change

To keep logic simple:

- Changing the **global cycle calendar** affects **future sprints only** by default.
- Changing the **shift/vacation calendar**:
  - affects assignment for **future sprints**,
  - may optionally trigger a re-assignment routine in the **current sprint** for tickets that:
    - are still in `todo` and
    - are currently unassigned.

This rule avoids unexpected reassignments mid-week unless explicitly triggered.
