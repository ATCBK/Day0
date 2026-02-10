import { Body, Controller, Param, Post } from "@nestjs/common";
import { CreateKbDto, SearchKbDto, UploadKbDto } from "./knowledge.dto";
import { KnowledgeService } from "./knowledge.service";

@Controller("kb")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  create(@Body() dto: CreateKbDto) {
    return this.knowledgeService.create(dto);
  }

  @Post(":id/upload")
  upload(@Param("id") id: string, @Body() dto: UploadKbDto) {
    return this.knowledgeService.upload(id, dto);
  }

  @Post(":id/search")
  search(@Param("id") id: string, @Body() dto: SearchKbDto) {
    return this.knowledgeService.search(id, dto);
  }
}
