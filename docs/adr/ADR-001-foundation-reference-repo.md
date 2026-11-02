# ADR-001: Foundation — Reference Repository Adoption

**Date:** 2026-11-01  
**Status:** Accepted (provisional — subject to M0 audit findings)  
**Deciders:** Project lead

---

## Context

The project uses [bhavinvagh/online_clothes_store](https://github.com/bhavinvagh/online_clothes_store) as its engineering foundation. This repository contains a MERN stack clothing store with separate `frontend/`, `admin/`, and `backend/` directories. The PRD explicitly states: *"Reuse suitable engineering from the reference project, not its identity, imagery or unverified integrations."*

## Decision

Adopt the reference repository's directory structure and core MERN architecture as the starting point for **QNK Noire Bags**, with the following constraints:

1. **Identity**: All branding (names, logos, colour tokens, copy, product imagery) from the reference repo is replaced with QNK Noire Bags brand assets.
2. **Security**: Known weak patterns (open CORS, JWT in client state, bcrypt) are recorded as M0 risks and will be addressed before launch.
3. **Reuse boundary**: Only use verified, working, secure code. Broken payment handling, weak auth patterns, and missing data integrity features are rebuilt — not patched with minimal changes.
4. **Credentials**: All credentials committed in the original repo's `.env` files have been redacted. Anyone with access to the original repository history must rotate those credentials.

## Consequences

- Faster initial setup (project structure already exists).
- M0 audit is mandatory before any feature build. Nothing is assumed to work until verified running locally with test data.
- TypeScript migration and architectural improvements (sessions, Argon2id, stock reservations, modular backend) are planned work, not optional.

---

## Alternatives considered

- **Build from scratch**: Would ensure clean architecture from day one but adds 5–10 days of scaffolding before any visible progress.
- **Use a commercial starter (e.g., Medusa, Vendure)**: More feature-complete but requires the team to learn a new platform and may not suit a simple single-merchant store.
