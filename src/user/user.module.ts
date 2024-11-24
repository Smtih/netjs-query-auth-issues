import { NestjsQueryGraphQLModule } from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { Module } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserEntity } from './user.entity';

@Module({
  imports: [
    NestjsQueryGraphQLModule.forFeature({
      // import the NestjsQueryTypeOrmModule to register the entity with typeorm
      // and provide a QueryService
      imports: [NestjsQueryTypeOrmModule.forFeature([UserEntity])],
      // describe the resolvers you want to expose
      resolvers: [
        {
          EntityClass: UserEntity,
          DTOClass: UserDTO,
        },
      ],
    }),
  ],
})
export class UserModule {}
