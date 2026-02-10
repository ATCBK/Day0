import { Body, Controller, Get, Param, Post, Query, Sse } from "@nestjs/common";
import { map } from "rxjs/operators";
import { RunWorkflowDto } from "./run.dto";
import { RunsService } from "./runs.service";

@Controller()
export class RunsController {
  constructor(private readonly runsService: RunsService) {}

  @Post("workflows/:id/run")
  runWorkflow(@Param("id") id: string, @Body() dto: RunWorkflowDto) {
    return this.runsService.runWorkflow(id, dto);
  }

  @Sse("runs/:runId/stream")
  stream(@Param("runId") runId: string) {
    return this.runsService.stream(runId).pipe(
      map((data) => ({
        type: "run_event",
        data
      }))
    );
  }

  @Get("runs/:runId/events")
  getEvents(@Param("runId") runId: string, @Query("afterSeq") afterSeq?: string) {
    return this.runsService.findEvents(runId, Number(afterSeq || 0));
  }
}
