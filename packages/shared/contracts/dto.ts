import type { GraphJson } from "./graph";
import type { Citation } from "./events";

export type CreateWorkflowDto = {
  name: string;
  graph: GraphJson;
};

export type UpdateWorkflowDto = {
  name?: string;
  graph?: GraphJson;
};

export type RunRequestDto = {
  input: Record<string, unknown>;
  sessionId?: string;
  historyTurns?: number;
};

export type RunResultDto = {
  runId: string;
  status: "queued" | "running" | "succeeded" | "failed";
  output?: string;
  citations?: Citation[];
};

export type KnowledgeSearchDto = {
  query: string;
  topK?: number;
};
