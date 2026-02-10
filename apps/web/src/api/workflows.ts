import { apiClient } from "./client";
import type { RunEvent } from "@/types";

export function getWorkflows() {
  return apiClient.get("/workflows");
}

export function runWorkflow(workflowId: string, payload: Record<string, unknown>) {
  return apiClient.post(`/workflows/${workflowId}/run`, payload);
}

export function createRunEventSource(runId: string) {
  return new EventSource(`http://localhost:3000/api/runs/${runId}/stream`);
}

export async function fetchRunEvents(runId: string, afterSeq: number) {
  const { data } = await apiClient.get<RunEvent[]>(`/runs/${runId}/events`, {
    params: { afterSeq }
  });
  return data;
}
