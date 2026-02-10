import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkflowsModule } from "../workflows/workflows.module";
import { RunEntity } from "./run.entity";
import { RunEventEntity } from "./run-event.entity";
import { RunsController } from "./runs.controller";
import { RunsService } from "./runs.service";

@Module({
  imports: [TypeOrmModule.forFeature([RunEntity, RunEventEntity]), WorkflowsModule],
  controllers: [RunsController],
  providers: [RunsService],
  exports: [RunsService]
})
export class RunsModule {}
