import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("messages")
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  sessionId!: string;

  @Column()
  role!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;
}
