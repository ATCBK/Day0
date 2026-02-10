import { IsOptional, IsString } from "class-validator";

export class CreateKbDto {
  @IsString()
  name!: string;
}

export class UploadKbDto {
  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  filename?: string;
}

export class SearchKbDto {
  @IsString()
  query!: string;
}
