# Graph JSON Spec (P0)

## Shape
```ts
{
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

## nodes
- `id: string`
- `type: "Start"|"Knowledge"|"Aggregate"|"Branch"|"LLM"|"End"`
- `data: NodeData`

## edges
- `id: string`
- `source: string`
- `target: string`
- `condition?: "true"|"false"` (for branch edges)

## node.data fixed fields
- Start: `{ inputSchema?: Record<string,string> }`
- Knowledge: `{ kbId: string; queryTemplate: string; topK?: number; outputVar?: string }`
- Aggregate: `{ assignments: Array<{ key: string; template: string }> }`
- Branch: `{ expression: string }`
- LLM: `{ systemPrompt?: string; userPromptTemplate: string; model?: string; outputVar?: string }`
- End: `{ resultTemplate: string }`

## TODO
- Add full DAG validation error examples.
