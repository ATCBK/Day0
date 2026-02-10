export type RunEventType = "node_status" | "log" | "final_result" | "error";

export type RunEvent = {
  runId: string;
  seq: number;
  timestamp: string;
  type: RunEventType;
  payload: NodeStatusPayload | LogPayload | FinalResultPayload | ErrorPayload;
};

export type NodeStatusPayload = {
  nodeId: string;
  nodeType: string;
  status: "started" | "succeeded" | "failed";
  message?: string;
};

export type LogPayload = {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  nodeId?: string;
};

export type Citation = {
  kbId: string;
  chunkId: string;
  score: number;
  snippet: string;
};

export type FinalResultPayload = {
  output: string;
  citations?: Citation[];
  variables?: Record<string, unknown>;
};

export type ErrorPayload = {
  code: string;
  message: string;
  nodeId?: string;
  details?: Record<string, unknown>;
};
