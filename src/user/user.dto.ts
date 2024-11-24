import {
  Authorize,
  FilterableField,
  IDField,
} from '@ptc-org/nestjs-query-graphql';
import { ObjectType, ID } from '@nestjs/graphql';

@ObjectType('User')
@Authorize<UserDTO>({
  authorize: (context) => ({ id: { eq: context.req.user.id } }),
})
export class UserDTO {
  @IDField(() => ID)
  id!: number;

  @FilterableField()
  name!: string;
}
