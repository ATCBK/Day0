import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { env } from "./config/env";
import { SqliteModule } from "./db/sqlite.module";
import { WorkflowsModule } from "./modules/workflows/workflows.module";
import { RunsModule } from "./modules/runs/runs.module";
import { KnowledgeModule } from "./modules/knowledge/knowledge.module";
import { LlmModule } from "./modules/llm/llm.module";
import { SessionsModule } from "./modules/sessions/sessions.module";
import { HealthController } from "./modules/health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => env.sqlite }),
    SqliteModule,
    WorkflowsModule,
    RunsModule,
    KnowledgeModule,
    LlmModule,
    SessionsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
