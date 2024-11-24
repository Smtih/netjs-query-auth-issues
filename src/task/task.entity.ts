import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  groupId!: string;

  @Column()
  assigneeId!: string;
}
