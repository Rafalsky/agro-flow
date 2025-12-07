SPRINTS, CYCLES & BOARD BEHAVIOUR – HARD RULES

The following rules are contractual.
Implementation MUST follow them exactly, without deviations or “smart” reinterpretations.

1. Definition of Sprint

A sprint is always a 7-day block (Monday → Sunday).
For any given calendar date:

If a sprint already exists that contains that date → use that sprint.

If no sprint exists → automatically create a sprint for the week containing that date.

Example:
If today is 2025-12-07 (Sunday), it belongs to the sprint:

start: 2025-12-01 (Monday)
end:   2025-12-07 (Sunday)


This sprint MUST be the one displayed on /board by default.

2. Default visible sprint in /board

When /board is opened:

Determine today’s date.

Locate or create the sprint for today.

Display this sprint immediately.

The sprint tabs at the top MUST show exactly 7 days: Monday → Sunday.

The tab representing today MUST be selected by default.

Example:
Today: 2025-12-07 (Sunday) → /board tabs MUST be:

1.12 | 2.12 | 3.12 | 4.12 | 5.12 | 6.12 | 7.12 (selected)


Failing to show the current sprint or selecting a future sprint is a bug.

3. Weekly Cycle is NOT the Board

The Cycle definition (/cycle) is a template only.
It does NOT influence the active sprint once that sprint has been generated.

Rules:

Editing the weekly cycle never changes the current sprint.

Moving tickets inside the board never changes the cycle.

Cycle defines what appears next week, not what appears now.

The board is fully editable per sprint.
This is intentional: every week farm conditions differ slightly.

4. Sprint Generation – When and How

A sprint is generated the first time it is needed:

Case A — Opening /board on Monday morning

There is no sprint for the new week yet.

System auto-creates a sprint for Monday → Sunday.

System instantiates all CYCLE entries into actual tickets for that sprint.

All generated tickets appear on board as UNASSIGNED (unless auto-assignment rules match exactly one worker).

Case B — Opening /board on any other day (Tue–Sun)

If the sprint exists → use it.

If not → create it the same way.

Case C — Midnight boundary

The system does not auto-roll itself at midnight unless requested.
Sprint generation always happens on demand (first access or explicit trigger).

5. Cycle → Sprint Instantiation (Critical Rule)

A CYCLE entry is a weekly template:

dayOfWeek = Sunday
timeSlot = morning


When creating a sprint covering Mon→Sun:

All templates whose dayOfWeek matches a date inside the sprint are instantiated.

Instantiated tickets become standard sprint tickets (CYCLE_INSTANCE).

They appear on the board for that specific date.

They belong to the sprint exactly like manually-created tickets.

Example:
If cycle contains “Clean Farrowing Pens – Sunday morning”,
then in the sprint for Dec 1–7, a ticket MUST exist on Dec 7.

If that sprint is generated on Monday (Dec 1), the ticket is still visible for Sunday (Dec 7) inside /board.

6. Moving Tickets on the Board Does NOT Change Cycle

If a zootechnician moves a ticket from Sunday to Friday or reassigns it:

Only the current sprint changes.

The cycle template remains unchanged.

Next week’s sprint will again generate the template as originally defined.

Cycle is the master pattern, sprint is the weekly working copy.

7. Editing CYCLE Does Not Retroactively Update the Sprint

Examples:

You add a new recurring task for Wednesday in /cycle.

It appears next week, not this week.

You modify a cycle task title.

Current sprint’s tickets remain as they are.

Next sprint will reflect the new title.

This ensures week-to-week stability and avoids accidental mid-sprint changes.

8. Tickets in Sprint Are Fully Editable

Inside a sprint:

Tickets can be reassigned.

Tickets can be moved to another day.

Titles/descriptions/checklists can be edited.

Tickets can be paused, started, completed, approved.

New NORMAL/EMERGENCY tickets can be added.

None of this affects the cycle template.

9. Workers and UNASSIGNED Lane

Generated cycle tickets that cannot be auto-assigned appear in UNASSIGNED.
Zootechnician assigns them manually.

Manual assignment does NOT update the cycle.

10. Summary (Agent Validation Checklist)

When implementing /board, the agent MUST verify:

 Today’s date determines default sprint.

 Tabs show exactly Mon→Sun of that sprint.

 Today’s tab is selected automatically.

 Cycle templates generate new sprint tickets only when sprint is created.

 Sprint mutations do not affect cycle.

 Cycle mutations do not affect existing sprint.

 Moving/assigning tickets in sprint updates only sprint state.

 Newly added cycle tasks appear next sprint, not current.

 Opening board on a new week auto-generates a sprint if none exists.

Failure to meet any rule = incorrect implementation.

11. Final Instruction to Agent

If board behaviour does not strictly follow these rules,
you MUST stop, correct the logic, and bring implementation back in line with this contract.

This behavioural model is not optional — it defines the core operational semantics of the system and MUST be respected across backend, frontend and real-time updates.