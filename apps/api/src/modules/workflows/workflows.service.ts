import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WorkflowEntity } from "./workflow.entity";
import { CreateWorkflowDto, UpdateWorkflowDto } from "./workflow.dto";

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(WorkflowEntity)
    private readonly workflowRepo: Repository<WorkflowEntity>
  ) {}

  async create(dto: CreateWorkflowDto) {
    const entity = this.workflowRepo.create({
      name: dto.name,
      graph: JSON.stringify(dto.graph)
    });
    return this.workflowRepo.save(entity);
  }

  async findAll() {
    return this.workflowRepo.find({ order: { createdAt: "DESC" } });
  }

  async findById(id: string) {
    const workflow = await this.workflowRepo.findOne({ where: { id } });
    if (!workflow) {
      throw new NotFoundException("WORKFLOW_NOT_FOUND");
    }
    return workflow;
  }

  async update(id: string, dto: UpdateWorkflowDto) {
    const workflow = await this.findById(id);
    if (dto.name !== undefined) workflow.name = dto.name;
    if (dto.graph !== undefined) workflow.graph = JSON.stringify(dto.graph);
    workflow.updatedAt = new Date().toISOString();
    return this.workflowRepo.save(workflow);
  }
}
