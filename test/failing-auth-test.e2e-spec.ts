import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { getApolloServer } from '@nestjs/apollo';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';

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

  test('create items in an unauthorized state', async () => {
    const result = await getApolloServer(app).executeOperation({
      query: gql`
        mutation ($input: CreateOneTodoItemInput!) {
          createOneTodoItem(input: $input) {
            id
            title
            completed
          }
        }
      `,
      variables: {
        input: {
          todoItem: {
            id: '1',
            title: 'Todo Item 1',
            completed: true,
          },
        },
      },
    });

    //Issue 1: Expect this not to create, or at least there to be configuration to prevent this
    expect(result.body).toMatchObject({
      singleResult: {
        errors: undefined,
        data: {
          createOneTodoItem: { id: '1', title: 'Todo Item 1', completed: true },
        },
      },
    });
  });

  test('relate items to an unauthorized item', async () => {
    const result = await getApolloServer(app).executeOperation({
      query: gql`
        mutation ($input: CreateOneSubTaskInput!) {
          createOneSubTask(input: $input) {
            id
            title
            completed
            todoItemId
          }
        }
      `,
      variables: {
        input: {
          subTask: {
            id: '1',
            title: 'Sub Task 1',
            completed: true,
            todoItemId: '1',
          },
        },
      },
    });

    //Issue 2: Expect this not to create, this one I'm not even sure there's a good implementation
    expect(result.body).toMatchObject({
      singleResult: {
        errors: undefined,
        data: {
          createOneSubTask: {
            id: '1',
            title: 'Sub Task 1',
            completed: true,
            todoItemId: '1',
          },
        },
      },
    });
  });

  test('resolve unauthorized task', async () => {
    const result = await getApolloServer(app).executeOperation({
      query: gql`
        query {
          subTasks {
            edges {
              node {
                completed
                id
                title
                todoItem {
                  id
                  completed
                  title
                }
              }
            }
          }
        }
      `,
      variables: {},
    });

    // Works as expected, get an error as I can not access the todo item
    expect(result.body).toMatchObject({
      singleResult: {
        errors: [
          {
            message:
              'Cannot return null for non-nullable field SubTask.todoItem.',
          },
        ],
        data: null,
      },
    });
  });

  test('filter on unauthorized tasks', async () => {
    const result = await getApolloServer(app).executeOperation({
      query: gql`
        query {
          subTasks {
            edges {
              node {
                completed
                id
                title
              }
            }
          }
        }
      `,
      variables: {
        filter: {
          todoItem: {
            title: {
              iLike: '%1%',
            },
          },
        },
      },
    });

    //Issue 3: Expect to find no results as I can't access the todo item
    expect(result.body).toMatchObject({
      singleResult: {
        errors: undefined,
        data: {
          subTasks: {
            edges: [
              {
                node: {
                  completed: true,
                  id: '1',
                  title: 'Sub Task 1',
                },
              },
            ],
          },
        },
      },
    });
  });
});
