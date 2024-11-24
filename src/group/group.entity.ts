import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GroupEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  ownerId!: string;
}
