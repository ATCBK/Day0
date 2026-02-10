import { defineStore } from "pinia";

export const useSessionStore = defineStore("sessionStore", {
  state: () => ({ sessionId: "", historyTurns: 6 })
});
