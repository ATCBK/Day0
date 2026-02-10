import { defineStore } from "pinia";

export const useKbStore = defineStore("kbStore", {
  state: () => ({ list: [] as Array<Record<string, unknown>> })
});
