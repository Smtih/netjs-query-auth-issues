import {
  Authorize,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';

@ObjectType('Task')
@Authorize<TaskDTO>({
  authorize: (context) => ({
    and: [
      { groupId: { in: context.req.user.groups } },
      { assigneeId: { eq: context.req.user.id } },
    ],
  }),
})
export class TaskDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  name!: string;

  @FilterableField()
  completed!: boolean;

  @FilterableField()
  groupId!: string;

  @FilterableField()
  assigneeId!: string;
}
