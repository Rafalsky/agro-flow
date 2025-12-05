# AgroFlow (Farm Task System)

This repository contains a bespoke task management system for a single pig farm.

The goal is to provide:

- a **worker-friendly mobile view** ("what I do today"),
- a **kanban board** for the zootechnician (planning, assignment, approval),
- a **read-only board** for stakeholders via a permanent magic link,
- a **weekly cycle** and **shift calendar** that auto-generate tasks.

The system is intentionally **single-tenant** and stores **no PII**  
(other than worker nicknames).

## Structure

```text
ferm-app/
  docs/
    domain/      # Framework-agnostic domain description (contract)
    api/         # HTTP + Realtime protocol contracts
  api/           # Backend implementation (NestJS)
  web/           # Frontend implementation (React)
  infra/         # Docker, e2e, deployment scripts
  README.md
  PROMPT.md      # AI IDE/System prompt (see below)

docs/domain and docs/api are the source of truth for behaviour.

api and web must implement these contracts.

infra glues everything together (docker-compose, e2e tests, envs).