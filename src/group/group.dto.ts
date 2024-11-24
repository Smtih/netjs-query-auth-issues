import {
  Authorize,
  FilterableField,
  FilterableUnPagedRelation,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';
import { TaskDTO } from '../task/task.dto';

@ObjectType('Group')
@Authorize<GroupDTO>({
  authorize: (context) => ({
    id: { in: context.req.user.groups },
  }),
})
@FilterableUnPagedRelation('tasks', () => TaskDTO)
export class GroupDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  name!: string;
}
