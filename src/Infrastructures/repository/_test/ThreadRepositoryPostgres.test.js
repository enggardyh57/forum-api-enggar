const pool = require('../../database/postgres/pool');

const UsersTableTestHelper =
  require('../../../../test/UsersTableTestHelper');

const ThreadsTableTestHelper =
  require('../../../../test/ThreadsTableTestHelper');

const ThreadRepositoryPostgres =
  require('../ThreadRepositoryPostgres');

const AddedThread =
  require('../../../Domains/threads/entities/AddedThread');

/* eslint-disable no-undef */
describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const newThread = {
        title: 'sebuah thread',
        body: 'isi thread',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres =
        new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      await threadRepositoryPostgres.addThread(
        newThread
      );

      // Assert
      const threads =
        await ThreadsTableTestHelper.findThreadById(
          'thread-123'
        );

      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      const newThread = {
        title: 'sebuah thread',
        body: 'isi thread',
        owner: 'user-123',
      };

      const fakeIdGenerator = () => '123';

      const threadRepositoryPostgres =
        new ThreadRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      const addedThread =
        await threadRepositoryPostgres.addThread(
          newThread
        );

      // Assert
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: 'thread-123',
          title: 'sebuah thread',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyThreadExists function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres =
        new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExists(
          'thread-xxx'
        )
      ).rejects.toThrowError(
        'thread tidak ditemukan'
      );
    });

    it('should not throw NotFoundError when thread exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});

      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres =
        new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.verifyThreadExists(
          'thread-123'
        )
      ).resolves.not.toThrowError();
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      await ThreadsTableTestHelper.addThread({});

      const threadRepositoryPostgres =
        new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread =
        await threadRepositoryPostgres.getThreadById(
          'thread-123'
        );

      // Assert
      expect(thread.id).toEqual(
        'thread-123'
      );

      expect(thread.title).toEqual(
        'sebuah thread'
      );

      expect(thread.body).toEqual(
        'sebuah body thread'
      );

      expect(thread.username).toEqual(
        'dicoding'
      );
    });
  });
});