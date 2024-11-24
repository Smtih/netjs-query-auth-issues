import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { GroupDTO } from './group.dto';
import { GroupEntity } from './group.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryTypeOrmModule to register the entity with typeorm
      // and provide a QueryService
      imports: [NestjsQueryTypeOrmModule.forFeature([GroupEntity])],
      // describe the resolvers you want to expose
      resolvers: [
        {
          EntityClass: GroupEntity,
          DTOClass: GroupDTO,
        },
      ],
    }),
  ],
})
export class GroupModule {}
