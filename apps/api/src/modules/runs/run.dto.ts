import { IsObject, IsOptional, IsString } from "class-validator";

export class RunWorkflowDto {
  @IsObject()
  input!: Record<string, unknown>;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
