import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { chunkText } from "../../shared/utils/chunk-text";
import { KnowledgeBaseEntity } from "./knowledge-base.entity";
import { KnowledgeChunkEntity } from "./knowledge-chunk.entity";
import { CreateKbDto, SearchKbDto, UploadKbDto } from "./knowledge.dto";

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectRepository(KnowledgeBaseEntity)
    private readonly kbRepo: Repository<KnowledgeBaseEntity>,
    @InjectRepository(KnowledgeChunkEntity)
    private readonly chunkRepo: Repository<KnowledgeChunkEntity>
  ) {}

  create(dto: CreateKbDto) {
    return this.kbRepo.save(this.kbRepo.create({ name: dto.name }));
  }

  async upload(id: string, dto: UploadKbDto) {
    const kb = await this.kbRepo.findOne({ where: { id } });
    if (!kb) throw new NotFoundException("KB_NOT_FOUND");

    const chunks = chunkText(dto.content, 400);
    const entities = chunks.map((content) => this.chunkRepo.create({ kbId: id, content }));
    return this.chunkRepo.save(entities);
  }

  async search(id: string, dto: SearchKbDto) {
    const kb = await this.kbRepo.findOne({ where: { id } });
    if (!kb) throw new NotFoundException("KB_NOT_FOUND");

    const chunks = await this.chunkRepo.find({ where: { kbId: id } });
    return chunks
      .map((c) => ({
        chunkId: c.id,
        kbId: id,
        snippet: c.content.slice(0, 200),
        score: c.content.includes(dto.query) ? 1 : 0
      }))
      .filter((c) => c.score > 0)
      .slice(0, 5);
  }
}
