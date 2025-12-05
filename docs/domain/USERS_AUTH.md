# Users and Authentication

## User Types (Domain Level)

The system uses three logical user types:

- **Worker**
  - Performs tasks.
  - Identified by a non-PII `displayName` (nickname).
  - No password, no email stored in the system.

- **Zootechnician**
  - Single main operational owner of the farm board.
  - Manages calendars, assignments, workers, and approvals.

- **Stakeholder (Read-only)**
  - Farm owner / director / other interested party.
  - Only reads board state, cannot modify anything.

The underlying technical user representation may be a generic `User` entity with a `role` field.

---

## PII Policy

- No personal data beyond a **nickname** is required.
- No email, phone or address is stored.
- Authentication is based on opaque tokens and magic links.
- Browser state is bound via **cookies**, not PII.

---

## Authentication Model

### General

- No traditional username/password logins.
- Identity is based on:
  - **activation links** for Workers and Zootechnician,
  - **permanent magic link** for Stakeholders.
- After link usage, the backend issues a **cookie token**.

### Cookie Token

- Random opaque string – not a JWT by default.
- Stored in DB with:
  - `token`
  - `userId`
  - `role`
  - `createdAt`, `lastSeenAt`
  - `isRevoked` flag
- Sent to client as HTTP cookie with:
  - `HttpOnly`
  - `Secure` (in production)
  - `SameSite=Lax`
  - **rolling expiration** (e.g. 14–30 days extended on each valid request).

On each request:

- backend reads cookie,
- verifies that the token exists and is not revoked,
- loads the user and role.

---

## Activation Links (Workers and Zootechnician)

### Worker Activation Flow

1. Zootechnician creates a Worker record (nickname only).
2. Backend generates an activation token:

   - `activationToken` stored in DB with:
     - `token`
     - `workerId`
     - `expiresAt`
     - `usedAt` (null until used)
     - `isRevoked`

3. Zootechnician uses UI to copy activation link and send it to the worker
   (e.g. via SMS/WhatsApp outside the system).

   Example link:
   `/activate?token=<activationToken>`

4. Worker opens the link on their device:
   - Backend validates token.
   - If valid:
     - creates a `cookie_token` bound to this worker.
     - marks activation token as `usedAt = now()`.
     - sets auth cookie.
     - redirects to `/app` (worker view).

5. If the token is invalid/expired/used → show generic 404-like page (no hint).

### Zootechnician Activation Flow

- Identical pattern, but:
  - the resulting user has `role = "zootechnician"`.
  - an additional **local PIN** is configured on first activation (optional).
    - PIN is known only to the Zootechnician and used for critical actions (e.g. admin screens).

Restoring a lost Zootechnician device may require a manual command or admin intervention to generate a new activation link.

---

## Magic Link for Stakeholders (Read-only)

Stakeholders use a **permanent magic link** for read-only board access.

Example URL:

`/overview/farm-status-rw4f8n5q`

Format:

- human-readable prefix (`farm-status`) +
- cryptographically random suffix (`rw4f8n5q`).

Flow:

1. Stakeholder opens the magic link.
2. Backend checks that the magicId is valid and active.
3. Backend issues a `cookie_token` with `role = "stakeholder_readonly"`.
4. Redirect to `/board` in **read-only** mode.

The magic link can be:

- revoked,
- rotated (new link generated, old one revoked).

No board data is visible without a valid cookie token.

---

## Revocation

- Any `cookie_token` can be marked as `isRevoked = true` in DB.
- Revocation takes effect immediately – even if cookies still exist in the browser.
- Activation tokens and magic links likewise support revocation.

---

## Authorisation Rules (Summary)

- `Worker`:
  - Can read and update only tickets where `assigneeId = workerId`.
  - Can change status only along allowed transitions.

- `Zootechnician`:
  - Full read/write on all tickets, calendars and workers.
  - Can generate activation tokens and stakeholder magic links.

- `Stakeholder`:
  - Read-only access to board and sprint information.
  - No mutation endpoints allowed.

Frontend must rely on backend for final enforcement – all critical checks are on server side.
