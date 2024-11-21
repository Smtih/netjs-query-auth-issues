import { TodoItemEntity } from '../todo-item/todo-item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectType,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubTaskEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  completed!: boolean;

  @Column({ nullable: false })
  todoItemId!: string;

  @ManyToOne(
    (): ObjectType<TodoItemEntity> => TodoItemEntity,
    (td) => td.subTasks,
    { onDelete: 'CASCADE', nullable: false },
  )
  @JoinColumn()
  todoItem!: TodoItemEntity;
}
