import { defineStore } from "pinia";

export const useRunStore = defineStore("runStore", {
  state: () => ({ currentRunId: "", events: [] as Array<Record<string, unknown>> })
});
