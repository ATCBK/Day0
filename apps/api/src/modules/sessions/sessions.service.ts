import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SessionEntity } from "./session.entity";
import { MessageEntity } from "./message.entity";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepo: Repository<MessageEntity>
  ) {}

  createSession() {
    return this.sessionRepo.save(this.sessionRepo.create());
  }

  addMessage(sessionId: string, role: string, content: string) {
    return this.messageRepo.save(this.messageRepo.create({ sessionId, role, content }));
  }

  async getRecentMessages(sessionId: string, turns = 6) {
    const rows = await this.messageRepo.find({
      where: { sessionId },
      order: { createdAt: "DESC" },
      take: turns * 2
    });
    return rows.reverse();
  }
}
