import { GroupEntity } from '../group/group.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class TaskEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  completed!: boolean;

  @Column()
  groupId!: string;

  @ManyToOne(() => GroupEntity, (group) => group.tasks)
  group!: GroupEntity;

  @Column()
  assigneeId!: string;
}
