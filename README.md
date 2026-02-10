# Simplified Coze Agent Platform Demo (P0)

## Scope (P0)
- Monorepo with `apps/web` + `apps/api` + `packages/shared`
- Minimal closed loop: Workflow CRUD + Run entry + SSE run events + SiliconFlow LLM client + keyword RAG + simple session history
- Single run entry: `POST /api/workflows/:id/run`
- Unified observability: `run_events` append-only, same schema for SSE and history replay
- Fixed node types: `Start`, `Knowledge`, `Aggregate`, `Branch`, `LLM`, `End`

## Out of Scope (NOT in P0)
- Agent binding priorities
- Advanced prompt builder
- Embedding/vector/hybrid retrieval
- Multi-tenant authorization
- Pause/rollback

## Stack
- Frontend: Vue3 + TypeScript + Vue Router + Pinia + Vue Flow + Element Plus
- Backend: NestJS + TypeScript + Swagger(OpenAPI)
- DB: SQLite
- LLM: SiliconFlow OpenAI-style API

## Quick Start
1. Install deps:
```bash
npm install
```
2. Run web:
```bash
npm run dev:web
```
3. Run api:
```bash
npm run dev:api
```
4. API docs:
- `http://localhost:3000/api/docs`
5. Health:
- `GET http://localhost:3000/health`

## API Skeleton (P0)
- `POST /api/workflows`
- `GET /api/workflows`
- `PUT /api/workflows/:id`
- `POST /api/workflows/:id/run`
- `GET /api/runs/:runId/stream`
- `GET /api/runs/:runId/events?afterSeq=`
- `POST /api/kb`
- `POST /api/kb/:id/upload`
- `POST /api/kb/:id/search`

## Notes
- Contracts are defined in `packages/shared/contracts` and mirrored in `docs/contracts`.
- Branch/Aggregate runtime can return `NODE_NOT_IMPLEMENTED` in P0.
- No extra engine/stream module is introduced.
