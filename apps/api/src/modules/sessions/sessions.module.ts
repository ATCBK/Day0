import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "./message.entity";
import { SessionEntity } from "./session.entity";
import { SessionsService } from "./sessions.service";

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity, MessageEntity])],
  providers: [SessionsService],
  exports: [SessionsService]
})
export class SessionsModule {}
