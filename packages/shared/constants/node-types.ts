export const NODE_TYPES = {
  START: "Start",
  KNOWLEDGE: "Knowledge",
  AGGREGATE: "Aggregate",
  BRANCH: "Branch",
  LLM: "LLM",
  END: "End"
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];
