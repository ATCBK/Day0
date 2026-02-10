import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("run_events")
export class RunEventEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  runId!: string;

  @Column()
  seq!: number;

  @Column()
  type!: string;

  @Column({ type: "text" })
  payload!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  timestamp!: string;
}
