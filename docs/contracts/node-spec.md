# Node Spec (P0 fixed 6 nodes)

## Start
- Inputs: run.input
- Outputs: initial variables map
- Config: inputSchema?
- Runtime: initializes context

## Knowledge
- Inputs: query template + variables
- Outputs: matched chunks/citations + optional variable assignment
- Config: kbId/queryTemplate/topK/outputVar
- Runtime: keyword search only

## Aggregate (SetVariable)
- Inputs: variables
- Outputs: variables update
- Config: assignments[]
- Runtime: may return `NODE_NOT_IMPLEMENTED` in P0

## Branch
- Inputs: variables
- Outputs: selects `true` or `false` edge
- Config: expression (supports `contains` and `==`)
- Runtime: may return `NODE_NOT_IMPLEMENTED` in P0

## LLM
- Inputs: prompt templates + optional history
- Outputs: model text + optional variable assignment
- Config: systemPrompt/userPromptTemplate/model/outputVar
- Runtime: SiliconFlow OpenAI-style call

## End
- Inputs: variables
- Outputs: final_result event
- Config: resultTemplate
- Runtime: render template to final output
