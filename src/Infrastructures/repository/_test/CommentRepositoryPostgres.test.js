const pool = require('../../database/postgres/pool');

const UsersTableTestHelper =
  require('../../../../test/UsersTableTestHelper');

const ThreadsTableTestHelper =
  require('../../../../test/ThreadsTableTestHelper');

const CommentsTableTestHelper =
  require('../../../../test/CommentsTableTestHelper');

const CommentRepositoryPostgres =
  require('../CommentRepositoryPostgres');

const AddedComment =
  require('../../../Domains/comments/entities/AddedComment');

/* eslint-disable no-undef */
describe('CommentRepositoryPostgres', () => {
 beforeEach(async () => {
  await CommentsTableTestHelper.cleanTable();
  await ThreadsTableTestHelper.cleanTable();
  await UsersTableTestHelper.cleanTable();

  await UsersTableTestHelper.addUser({
    id: 'user-123',
    username: 'dicoding',
  });

  await ThreadsTableTestHelper.addThread({
    id: 'thread-123',
    owner: 'user-123',
  });
});

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist comment', async () => {
      // Arrange
      const newComment = {
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      await commentRepositoryPostgres.addComment(
        newComment
      );

      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentById(
          'comment-123'
        );

      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = {
        content: 'sebuah comment',
        owner: 'user-123',
        threadId: 'thread-123',
      };

      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      const addedComment =
        await commentRepositoryPostgres.addComment(
          newComment
        );

      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: 'comment-123',
          content: 'sebuah comment',
          owner: 'user-123',
        })
      );
    });
  });

  describe('verifyCommentExists function', () => {
    it('should throw error when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExists(
          'comment-xxx'
        )
      ).rejects.toThrowError(
        'comment tidak ditemukan'
      );
    });

    it('should not throw error when comment exists', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExists(
          'comment-123'
        )
      ).resolves.not.toThrowError();
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw error when owner not match', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          'comment-123',
          'user-xxx'
        )
      ).rejects.toThrowError(
        'anda tidak berhak'
      );
    });

    it('should not throw error when owner match', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner(
          'comment-123',
          'user-123'
        )
      ).resolves.not.toThrowError();
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres
        .deleteComment(
          'comment-123'
        );

      // Assert
      const comments =
        await CommentsTableTestHelper.findCommentById(
          'comment-123'
        );

      expect(comments[0].is_delete)
        .toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres =
        new CommentRepositoryPostgres(pool, {});

      // Action
      const comments =
        await commentRepositoryPostgres
          .getCommentsByThreadId(
            'thread-123'
          );

      // Assert
      expect(comments).toHaveLength(1);

      expect(comments[0].id)
        .toEqual('comment-123');

      expect(comments[0].username)
        .toEqual('dicoding');

      expect(comments[0].content)
        .toEqual('sebuah comment');
    });
  });
});