import { defineStore } from "pinia";
import { ElMessage } from "element-plus";
import type {
  ErrorPayload,
  FinalResultPayload,
  LogPayload,
  NodeStatusPayload,
  RunEvent,
  RunEventType
} from "@/types";
import { createRunEventSource, fetchRunEvents, runWorkflow } from "@/api/workflows";

type RunStatus = "IDLE" | "RUNNING" | "SUCCESS" | "FAILED";

type RunLog = {
  seq: number;
  nodeId?: string;
  level?: string;
  message?: string;
  ts: string;
};

let eventSource: EventSource | null = null;
let reconnectTimer: number | null = null;

export const useRunStore = defineStore("runStore", {
  state: () => ({
    runId: "",
    status: "IDLE" as RunStatus,
    nodeStatuses: {} as Record<string, string>,
    logs: [] as RunLog[],
    finalResult: null as { text: string; citations: FinalResultPayload["citations"] } | null,
    lastSeq: 0
  }),

  actions: {
    resetRun() {
      this.status = "IDLE";
      this.nodeStatuses = {};
      this.logs = [];
      this.finalResult = null;
      this.lastSeq = 0;
      this.closeStream();
    },

    async startRun(workflowId: string, userInput = "") {
      this.status = "RUNNING";
      this.nodeStatuses = {};
      this.logs = [];
      this.finalResult = null;
      this.lastSeq = 0;

      const payload = {
        user_input: userInput,
        session_id: undefined,
        input: {
          input: userInput,
          user_input: userInput
        }
      };

      // TODO(P1): if backend run API requires graph_json, append workflowStore.toGraphJson() here.
      const { data } = await runWorkflow(workflowId, payload);
      this.runId = String(data.runId || "");

      if (!this.runId) {
        this.status = "FAILED";
        throw new Error("runId missing in /run response");
      }

      this.connectSSE(this.runId);
      return this.runId;
    },

    connectSSE(runId: string) {
      this.closeStream();

      console.info("[runStore] connectSSE", { runId, fromSeq: this.lastSeq });
      eventSource = createRunEventSource(runId);
      eventSource.addEventListener("run_event", (evt) => {
        const message = evt as MessageEvent<string>;
        this.handleEvent(this.parseEvent(message.data));
      });

      eventSource.onerror = async () => {
        if (this.status !== "RUNNING") return;

        console.warn("[runStore] SSE disconnected, start replay", {
          runId,
          afterSeq: this.lastSeq
        });
        this.closeStream();

        try {
          await this.fetchEvents(runId, this.lastSeq);
          console.info("[runStore] replay finished, reconnecting", {
            runId,
            afterSeq: this.lastSeq
          });
        } catch {
          console.error("[runStore] replay failed", { runId, afterSeq: this.lastSeq });
          ElMessage.warning("SSE 补偿拉取失败，正在重试");
        }

        reconnectTimer = window.setTimeout(() => {
          this.connectSSE(runId);
        }, 1200);
      };
    },

    async fetchEvents(runId: string, afterSeq: number) {
      const events = await fetchRunEvents(runId, afterSeq);
      events.forEach((event) => {
        this.handleEvent(event);
      });
    },

    handleEvent(event: RunEvent | null) {
      if (!event) return;

      this.lastSeq = Math.max(this.lastSeq, Number(event.seq || 0));

      if (event.type === "node_status") {
        const payload = event.payload as NodeStatusPayload;
        this.nodeStatuses[payload.nodeId] = payload.status;
        this.logs.push({
          seq: event.seq,
          nodeId: payload.nodeId,
          level: "info",
          message: `${payload.nodeType} ${payload.status}`,
          ts: event.timestamp
        });
      }

      if (event.type === "log") {
        const payload = event.payload as LogPayload;
        this.logs.push({
          seq: event.seq,
          nodeId: payload.nodeId,
          level: payload.level,
          message: payload.message,
          ts: event.timestamp
        });
      }

      if (event.type === "final_result") {
        const payload = event.payload as FinalResultPayload;
        this.finalResult = {
          text: payload.output,
          citations: payload.citations
        };
        this.status = "SUCCESS";
      }

      if (event.type === "error") {
        const payload = event.payload as ErrorPayload;
        this.status = "FAILED";
        this.logs.push({
          seq: event.seq,
          nodeId: payload.nodeId,
          level: "error",
          message: `${payload.code}: ${payload.message}`,
          ts: event.timestamp
        });
        ElMessage.error(payload.message);
      }
    },

    parseEvent(raw: string): RunEvent | null {
      try {
        const parsed = JSON.parse(raw) as RunEvent;
        if (!this.isEventType(parsed.type)) {
          return null;
        }
        return parsed;
      } catch {
        return null;
      }
    },

    isEventType(type: string): type is RunEventType {
      return type === "node_status" || type === "log" || type === "final_result" || type === "error";
    },

    closeStream() {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    }
  }
});
