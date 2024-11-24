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
        .save({ id: 'user-2', name: 'Me' });
      await dataSource
        .getRepository(GroupEntity)
        .save({ id: 'group-1', name: 'Group 1', ownerId: 'user-1' });
      await dataSource.getRepository(TaskEntity).save({
        id: 'task-1',
        name: 'Owners Secret Task',
        completed: false,
        assigneeId: 'user-1',
        groupId: 'group-1',
      });
      await dataSource.getRepository(TaskEntity).save({
        id: 'task-2',
        name: 'My Secret Task',
        completed: true,
        assigneeId: 'user-2',
        groupId: 'group-1',
      });
    });

    test('Find my groups where I have not completed all my tasks', async () => {
      const result = await getApolloServer(app).executeOperation(
        {
          query: gql`
            query AllGroups($filter: GroupFilter!) {
              groups(filter: $filter) {
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
                completed: {
                  is: false,
                },
                /**
                 * I need to specify my user id otherwise I'll get
                 * `my` groups where there are any uncompleted tasks
                 */
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

      expect(result.body).toMatchObject({
        singleResult: {
          errors: undefined,
          data: {
            groups: {
              edges: [],
            },
          },
        },
      });
    });

    test('Find my groups where others have not completed tasks', async () => {
      const result = await getApolloServer(app).executeOperation(
        {
          query: gql`
            query AllGroups($filter: GroupFilter!) {
              groups(filter: $filter) {
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
                completed: {
                  is: false,
                },
                assigneeId: {
                  neq: 'user-2',
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
       * I can now spy on other users and whether they have completed tasks or not
       * even though I have no permission to their tasks by seeing if this query returns a group
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
