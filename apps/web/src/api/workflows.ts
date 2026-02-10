import { apiClient } from "./client";

export function getWorkflows() {
  return apiClient.get("/workflows");
}

export function runWorkflow(workflowId: string, input: Record<string, unknown>) {
  return apiClient.post(`/workflows/${workflowId}/run`, { input });
}

export function createRunEventSource(runId: string) {
  return new EventSource(`http://localhost:3000/api/runs/${runId}/stream`);
}
