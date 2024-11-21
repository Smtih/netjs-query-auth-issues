import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { SubTaskDTO } from './sub-task.dto';
import { SubTaskEntity } from './sub-task.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryTypeOrmModule to register the entity with typeorm
      // and provide a QueryService
      imports: [NestjsQueryTypeOrmModule.forFeature([SubTaskEntity])],
      // describe the resolvers you want to expose
      resolvers: [
        {
          EntityClass: SubTaskEntity,
          DTOClass: SubTaskDTO,
        },
      ],
    }),
  ],
})
export class SubTaskModule {}
