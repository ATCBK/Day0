import type { NodeType } from "../constants/node-types";

export type GraphNode = {
  id: string;
  type: NodeType;
  data: NodeData;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  condition?: "true" | "false";
};

export type GraphJson = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type NodeData = {
  start?: StartNodeData;
  knowledge?: KnowledgeNodeData;
  aggregate?: AggregateNodeData;
  branch?: BranchNodeData;
  llm?: LlmNodeData;
  end?: EndNodeData;
  [k: string]: unknown;
};

export type StartNodeData = {
  inputSchema?: Record<string, string>;
};

export type KnowledgeNodeData = {
  kbId: string;
  queryTemplate: string;
  topK?: number;
  outputVar?: string;
};

export type AggregateNodeData = {
  assignments: Array<{ key: string; template: string }>;
};

export type BranchNodeData = {
  expression: string;
};

export type LlmNodeData = {
  systemPrompt?: string;
  userPromptTemplate: string;
  model?: string;
  outputVar?: string;
};

export type EndNodeData = {
  resultTemplate: string;
};
