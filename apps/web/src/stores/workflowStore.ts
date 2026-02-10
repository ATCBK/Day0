import { defineStore } from "pinia";

export const useWorkflowStore = defineStore("workflowStore", {
  state: () => ({ workflows: [] as Array<Record<string, unknown>> })
});
