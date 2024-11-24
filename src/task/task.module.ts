import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { TaskDTO } from './task.dto';
import { TaskEntity } from './task.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryTypeOrmModule to register the entity with typeorm
      // and provide a QueryService
      imports: [NestjsQueryTypeOrmModule.forFeature([TaskEntity])],
      // describe the resolvers you want to expose
      resolvers: [
        {
          EntityClass: TaskEntity,
          DTOClass: TaskDTO,
        },
      ],
    }),
  ],
})
export class TaskModule {}
