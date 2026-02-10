import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Observable, Subject } from "rxjs";
import { Repository } from "typeorm";
import { WorkflowsService } from "../workflows/workflows.service";
import { RunEntity } from "./run.entity";
import { RunEventEntity } from "./run-event.entity";
import { RunWorkflowDto } from "./run.dto";
import { renderTemplate } from "../../shared/utils/render-template";

@Injectable()
export class RunsService {
  private readonly eventBus = new Map<string, Subject<unknown>>();

  constructor(
    @InjectRepository(RunEntity)
    private readonly runRepo: Repository<RunEntity>,
    @InjectRepository(RunEventEntity)
    private readonly eventRepo: Repository<RunEventEntity>,
    private readonly workflowsService: WorkflowsService
  ) {}

  async runWorkflow(workflowId: string, dto: RunWorkflowDto) {
    const workflow = await this.workflowsService.findById(workflowId);
    const run = await this.runRepo.save(
      this.runRepo.create({
        workflowId,
        status: "running",
        inputJson: JSON.stringify(dto.input)
      })
    );

    await this.appendEvent(run.id, "log", {
      level: "info",
      message: "Run started"
    });

    const output = renderTemplate("Run accepted for workflow ${vars.id}", {
      id: workflow.id
    });

    run.status = "succeeded";
    run.output = output;
    await this.runRepo.save(run);

    await this.appendEvent(run.id, "final_result", {
      output,
      variables: dto.input
    });

    return { runId: run.id, status: run.status, output: run.output };
  }

  stream(runId: string): Observable<unknown> {
    if (!this.eventBus.has(runId)) {
      this.eventBus.set(runId, new Subject<unknown>());
    }
    return this.eventBus.get(runId)!.asObservable();
  }

  async findEvents(runId: string, afterSeq: number) {
    return this.eventRepo.find({
      where: { runId },
      order: { seq: "ASC" }
    }).then((events) =>
      events
        .filter((e) => e.seq > afterSeq)
        .map((e) => ({ ...e, payload: JSON.parse(e.payload) }))
    );
  }

  private async appendEvent(runId: string, type: string, payload: Record<string, unknown>) {
    const last = await this.eventRepo.findOne({ where: { runId }, order: { seq: "DESC" } });
    const seq = last ? last.seq + 1 : 1;
    const event = await this.eventRepo.save(
      this.eventRepo.create({
        runId,
        seq,
        type,
        payload: JSON.stringify(payload)
      })
    );

    const envelope = {
      runId,
      seq,
      timestamp: event.timestamp,
      type,
      payload
    };

    if (!this.eventBus.has(runId)) {
      this.eventBus.set(runId, new Subject<unknown>());
    }
    this.eventBus.get(runId)!.next(envelope);
  }
}
