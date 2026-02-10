import { IsObject, IsOptional, IsString } from "class-validator";

export class CreateWorkflowDto {
  @IsString()
  name!: string;

  @IsObject()
  graph!: Record<string, unknown>;
}

export class UpdateWorkflowDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsObject()
  graph?: Record<string, unknown>;
}
