import { join } from "node:path";
import { DataSourceOptions } from "typeorm";
import { WorkflowEntity } from "../modules/workflows/workflow.entity";
import { RunEntity } from "../modules/runs/run.entity";
import { RunEventEntity } from "../modules/runs/run-event.entity";
import { KnowledgeBaseEntity } from "../modules/knowledge/knowledge-base.entity";
import { KnowledgeChunkEntity } from "../modules/knowledge/knowledge-chunk.entity";
import { SessionEntity } from "../modules/sessions/session.entity";
import { MessageEntity } from "../modules/sessions/message.entity";

const sqlitePath = process.env.SQLITE_PATH || "./data/app.db";

export const env = {
  siliconFlow: {
    baseUrl: process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.cn/v1",
    apiKey:
      process.env.SILICONFLOW_API_KEY ||
      "sk-jhxuzjtuoyuodtvbecudrqfzyeivneumsojdkkxlxbwlpgfx",
    model: process.env.SILICONFLOW_MODEL || "Qwen/Qwen2.5-7B-Instruct"
  },
  sqlite: {
    type: "sqlite",
    database: join(process.cwd(), sqlitePath),
    entities: [
      WorkflowEntity,
      RunEntity,
      RunEventEntity,
      KnowledgeBaseEntity,
      KnowledgeChunkEntity,
      SessionEntity,
      MessageEntity
    ],
    synchronize: true
  } as DataSourceOptions
};
