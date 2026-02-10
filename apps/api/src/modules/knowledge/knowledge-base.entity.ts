import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("knowledge_bases")
export class KnowledgeBaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;
}
