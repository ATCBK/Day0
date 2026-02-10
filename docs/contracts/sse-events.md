# SSE Events Spec (P0 fixed)

## Stream endpoint
- `GET /api/runs/:runId/stream`
- SSE event name: `run_event`

## Replay endpoint
- `GET /api/runs/:runId/events?afterSeq=`
- Returns same schema as SSE payload list

## Event envelope
```ts
{
  runId: string;
  seq: number;
  timestamp: string;
  type: "node_status" | "log" | "final_result" | "error";
  payload: object;
}
```

## `node_status` payload
```ts
{
  nodeId: string;
  nodeType: string;
  status: "started" | "succeeded" | "failed";
  message?: string;
}
```

## `log` payload
```ts
{
  level: "debug" | "info" | "warn" | "error";
  message: string;
  nodeId?: string;
}
```

## `final_result` payload
```ts
{
  output: string;
  citations?: Array<{ kbId: string; chunkId: string; score: number; snippet: string }>;
  variables?: Record<string, unknown>;
}
```

## `error` payload
```ts
{
  code: string;
  message: string;
  nodeId?: string;
  details?: Record<string, unknown>;
}
```
