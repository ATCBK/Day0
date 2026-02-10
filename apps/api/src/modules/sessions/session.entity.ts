import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sessions")
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: string;
}
