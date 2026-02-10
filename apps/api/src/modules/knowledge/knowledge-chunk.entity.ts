import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("kb_chunks")
export class KnowledgeChunkEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  kbId!: string;

  @Column({ type: "text" })
  content!: string;
}
