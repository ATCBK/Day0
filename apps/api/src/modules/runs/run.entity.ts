import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("runs")
export class RunEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  workflowId!: string;

  @Column({ default: "queued" })
  status!: string;

  @Column({ type: "text", nullable: true })
  output?: string;

  @Column({ type: "text", nullable: true })
  inputJson?: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;
}
