import {
  FilterableField,
  FilterableRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { TodoItemDTO } from '../todo-item/todo-item.dto';

@ObjectType('SubTask')
@FilterableRelation('todoItem', () => TodoItemDTO)
export class SubTaskDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  title!: string;

  @FilterableField()
  completed!: boolean;

  @FilterableField()
  todoItemId!: string;
}
