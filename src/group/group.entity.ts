import { TaskEntity } from '../task/task.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class GroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  ownerId!: string;

  @OneToMany(() => TaskEntity, (task) => task.group)
  tasks: TaskEntity[];
}
