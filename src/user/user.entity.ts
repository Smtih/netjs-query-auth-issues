import { GroupEntity } from '../group/group.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @ManyToMany(() => GroupEntity)
  @JoinTable()
  groups!: GroupEntity[];
}
