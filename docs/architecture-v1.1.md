# Architecture v1.1 (P0 Converged)

## Topology
- Monorepo: `apps/web`, `apps/api`, `packages/shared`
- Single run entry: `POST /api/workflows/:id/run`
- Unified event stream: `run_events` append-only for both SSE and replay

## Runtime Flow
1. Web submits run request.
2. API validates DAG and executes nodes in order.
3. API appends events to `run_events` and broadcasts via SSE.
4. Web can reconnect and replay from `GET /api/runs/:runId/events?afterSeq=`.

## Node Set (fixed)
- `Start`
- `Knowledge`
- `Aggregate` (SetVariable)
- `Branch` (true/false)
- `LLM`
- `End`

## Data
- SQLite single-node DB (`./data/app.db`)
- Core tables: workflows, runs, run_events, knowledge_bases, kb_chunks, sessions, messages

## P0 Constraints
- No EngineModule/StreamModule split
- No LangChain or similar frameworks
- Branch/Aggregate can return `NODE_NOT_IMPLEMENTED`
