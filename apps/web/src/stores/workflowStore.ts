import { defineStore } from "pinia";
import type { Connection, Edge, Node, XYPosition } from "@vue-flow/core";
import { NODE_TYPES } from "@/types";
import type { GraphJson, NodeData, NodeType } from "@/types";

export type WorkflowNode = Omit<Node<NodeData>, "type" | "data"> & {
  type: NodeType;
  data: NodeData;
};

export type WorkflowEdge = Edge & { condition?: "true" | "false" };

type MappingRow = { to: string; from: string; default?: unknown };

type WorkflowPersisted = {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

const keyOf = (workflowId: string) => `workflow:${workflowId}`;

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

function defaultNodeData(type: NodeType): NodeData {
  if (type === NODE_TYPES.START) return { start: {} };

  if (type === NODE_TYPES.KNOWLEDGE) {
    return {
      kbId: "",
      topK: 5,
      knowledge: {
        kbId: "",
        topK: 5,
        queryTemplate: "${vars.input}",
        outputVar: "kb_context"
      }
    };
  }

  if (type === NODE_TYPES.AGGREGATE) {
    return {
      mappings: [{ to: "", from: "", default: "" }] as MappingRow[],
      aggregate: { assignments: [{ key: "", template: "" }] }
    };
  }

  if (type === NODE_TYPES.BRANCH) {
    return {
      expression: "contains(vars.input,\"\")",
      trueLabel: "true",
      falseLabel: "false",
      branch: { expression: "contains(vars.input,\"\")" }
    };
  }

  if (type === NODE_TYPES.LLM) {
    const model = "Qwen/Qwen2.5-7B-Instruct";
    const userTemplate = "用户输入: ${vars.input}\n知识上下文: ${vars.kb_context}";

    return {
      model,
      temperature: 0.7,
      system_prompt: "",
      user_template: userTemplate,
      llm: {
        model,
        userPromptTemplate: userTemplate,
        systemPrompt: "",
        outputVar: "llm_output"
      }
    };
  }

  return {
    outputSource: "vars.llm_output",
    end: { resultTemplate: "vars.llm_output" }
  };
}

function normalizeData(type: NodeType, raw: NodeData): NodeData {
  const next: NodeData = structuredClone(raw || {});

  if (type === NODE_TYPES.KNOWLEDGE) {
    const kbId = String(next.kbId ?? next.knowledge?.kbId ?? "");
    const topK = Number(next.topK ?? next.knowledge?.topK ?? 5);
    next.kbId = kbId;
    next.topK = topK;
    next.knowledge = {
      kbId,
      topK,
      queryTemplate: next.knowledge?.queryTemplate || "${vars.input}",
      outputVar: next.knowledge?.outputVar || "kb_context"
    };
  }

  if (type === NODE_TYPES.AGGREGATE) {
    const mappings = Array.isArray(next.mappings)
      ? (next.mappings as MappingRow[])
      : [{ to: "", from: "", default: "" }];
    next.mappings = mappings;
    next.aggregate = {
      assignments: mappings.map((row) => ({
        key: String(row.to || ""),
        template: String(row.from || "")
      }))
    };
  }

  if (type === NODE_TYPES.BRANCH) {
    const expression = String(next.expression ?? next.branch?.expression ?? "contains(vars.input,\"\")");
    next.expression = expression;
    next.trueLabel = String(next.trueLabel ?? "true");
    next.falseLabel = String(next.falseLabel ?? "false");
    next.branch = { expression };
  }

  if (type === NODE_TYPES.LLM) {
    const model = String(next.model ?? next.llm?.model ?? "Qwen/Qwen2.5-7B-Instruct");
    const systemPrompt = String(next.system_prompt ?? next.llm?.systemPrompt ?? "");
    const userTemplate = String(
      next.user_template ??
        next.llm?.userPromptTemplate ??
        "用户输入: ${vars.input}\n知识上下文: ${vars.kb_context}"
    );
    const temperature = Number(next.temperature ?? 0.7);

    next.model = model;
    next.system_prompt = systemPrompt;
    next.user_template = userTemplate;
    next.temperature = Number.isNaN(temperature) ? 0.7 : temperature;
    next.llm = {
      model,
      systemPrompt,
      userPromptTemplate: userTemplate,
      outputVar: next.llm?.outputVar || "llm_output"
    };
  }

  if (type === NODE_TYPES.END) {
    const outputSource = String(next.outputSource ?? next.end?.resultTemplate ?? "vars.llm_output");
    next.outputSource = outputSource;
    next.end = { resultTemplate: outputSource };
  }

  return next;
}

function defaultGraph(workflowId: string): WorkflowPersisted {
  const startId = uid("start");
  const llmId = uid("llm");
  const endId = uid("end");

  return {
    id: workflowId,
    name: `Workflow ${workflowId}`,
    nodes: [
      {
        id: startId,
        type: NODE_TYPES.START,
        position: { x: 100, y: 160 },
        data: defaultNodeData(NODE_TYPES.START),
        draggable: true
      },
      {
        id: llmId,
        type: NODE_TYPES.LLM,
        position: { x: 390, y: 160 },
        data: defaultNodeData(NODE_TYPES.LLM),
        draggable: true
      },
      {
        id: endId,
        type: NODE_TYPES.END,
        position: { x: 700, y: 160 },
        data: defaultNodeData(NODE_TYPES.END),
        draggable: true
      }
    ],
    edges: [
      { id: uid("edge"), source: startId, target: llmId },
      { id: uid("edge"), source: llmId, target: endId }
    ]
  };
}

export const useWorkflowStore = defineStore("workflowStore", {
  state: () => ({
    workflowId: "",
    name: "",
    nodes: [] as WorkflowNode[],
    edges: [] as WorkflowEdge[],
    selectedNodeId: "",
    selectedEdgeId: "",
    dirty: false
  }),

  actions: {
    load(workflowId: string) {
      this.workflowId = workflowId;
      const saved = localStorage.getItem(keyOf(workflowId));
      const parsed = saved ? (JSON.parse(saved) as WorkflowPersisted) : defaultGraph(workflowId);

      this.name = parsed.name;
      this.nodes = parsed.nodes.map((node) => ({
        ...node,
        data: normalizeData(node.type, (node.data || {}) as NodeData)
      }));
      this.edges = parsed.edges;
      this.selectedNodeId = "";
      this.selectedEdgeId = "";
      this.dirty = false;
    },

    save() {
      if (!this.workflowId) return;
      const payload: WorkflowPersisted = {
        id: this.workflowId,
        name: this.name || `Workflow ${this.workflowId}`,
        nodes: this.nodes,
        edges: this.edges
      };
      localStorage.setItem(keyOf(this.workflowId), JSON.stringify(payload));
      this.dirty = false;
    },

    toGraphJson(): GraphJson {
      return {
        nodes: this.nodes.map((n) => ({ id: n.id, type: n.type, data: normalizeData(n.type, n.data) })),
        edges: this.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          condition: e.condition
        }))
      };
    },

    addNode(type: NodeType, position?: XYPosition) {
      const node: WorkflowNode = {
        id: uid(type.toLowerCase()),
        type,
        position: position || { x: 250, y: 200 },
        data: defaultNodeData(type),
        draggable: true
      };
      this.nodes.push(node);
      this.selectedNodeId = node.id;
      this.selectedEdgeId = "";
      this.dirty = true;
    },

    updateNodePosition(nodeId: string, position: XYPosition) {
      const target = this.nodes.find((n) => n.id === nodeId);
      if (!target) return;
      target.position = position;
      this.dirty = true;
    },

    selectNode(nodeId: string) {
      this.selectedNodeId = nodeId;
      this.selectedEdgeId = "";
    },

    clearSelection() {
      this.selectedNodeId = "";
      this.selectedEdgeId = "";
    },

    selectEdge(edgeId: string) {
      this.selectedEdgeId = edgeId;
      this.selectedNodeId = "";
    },

    updateSelectedNodeData(data: Record<string, unknown>) {
      const node = this.nodes.find((n) => n.id === this.selectedNodeId);
      if (!node) return;
      node.data = normalizeData(node.type, data as NodeData);
      this.dirty = true;
    },

    removeSelectedNode() {
      if (!this.selectedNodeId) return;
      const nodeId = this.selectedNodeId;
      this.nodes = this.nodes.filter((n) => n.id !== nodeId);
      this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      this.selectedNodeId = "";
      this.dirty = true;
    },

    removeSelectedEdge() {
      if (!this.selectedEdgeId) return;
      this.edges = this.edges.filter((e) => e.id !== this.selectedEdgeId);
      this.selectedEdgeId = "";
      this.dirty = true;
    },

    addEdge(connection: Connection): { ok: boolean; reason?: string } {
      if (!connection.source || !connection.target) {
        return { ok: false, reason: "连线缺少 source/target" };
      }

      if (connection.source === connection.target) {
        return { ok: false, reason: "禁止节点连接到自身" };
      }

      if (this.edges.some((edge) => edge.target === connection.target)) {
        return { ok: false, reason: "目标输入端口已占用，仅支持单连" };
      }

      const sourceNode = this.nodes.find((n) => n.id === connection.source);
      const edge: WorkflowEdge = {
        id: uid("edge"),
        source: connection.source,
        target: connection.target
      };

      if (sourceNode?.type === NODE_TYPES.BRANCH) {
        const condition =
          connection.sourceHandle === "true" || connection.sourceHandle === "false"
            ? connection.sourceHandle
            : undefined;

        edge.condition = condition;
        if (condition === "true") edge.label = String(sourceNode.data?.trueLabel || "true");
        if (condition === "false") edge.label = String(sourceNode.data?.falseLabel || "false");
      }

      this.edges.push(edge);
      this.dirty = true;
      return { ok: true };
    }
  }
});
