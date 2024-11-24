import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getApolloServer } from '@nestjs/apollo';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { UserEntity } from '../src/user/user.entity';
import { GroupEntity } from '../src/group/group.entity';
import { TaskEntity } from '../src/task/task.entity';

describe('Failing Auth Test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableShutdownHooks();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('leaking sensitive information scenario', () => {
    beforeAll(async () => {
      const dataSource = app.get(getDataSourceToken());

      await dataSource
        .getRepository(UserEntity)
        .save({ id: 'user-1', name: 'Group Owner' });
      await dataSource
        .getRepository(UserEntity)
        .save({ id: 'user-2', name: 'Group Member' });
      await dataSource
        .getRepository(GroupEntity)
        .save({ id: 'group-1', name: 'Group 1', ownerId: '1' });
      await dataSource.getRepository(TaskEntity).save({
        id: 'task-1',
        name: 'Owners Secret Task',
        assigneeId: 'user-1',
        groupId: 'group-1',
      });
      await dataSource.getRepository(TaskEntity).save({
        id: 'task-2',
        name: 'Members Secret Task',
        assigneeId: 'user-2',
        groupId: 'group-1',
      });
    });

    test('Find my groups with tasks assigned to another user', async () => {
      const result = await getApolloServer(app).executeOperation(
        {
          query: gql`
            query {
              groups {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          `,
          variables: {
            filter: {
              tasks: {
                assigneeId: {
                  eq: 'user-2',
                },
              },
            },
          },
        },
        {
          contextValue: {
            req: { user: { id: 'user-2', groups: ['group-1'] } },
          },
        },
      );

      /**
       * The fact I return a group here means that this group has a task assigned to user-2.
       * The permissions I've set up would ideally not allow me to infer such information
       * as I don't have any permissions to user-2 or their tasks, we just happen to share a group.
       */
      expect(result.body).toMatchObject({
        singleResult: {
          errors: undefined,
          data: {
            groups: {
              edges: [
                {
                  node: {
                    id: 'group-1',
                    name: 'Group 1',
                  },
                },
              ],
            },
          },
        },
      });
    });
  });
});
