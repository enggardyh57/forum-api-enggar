const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailedComment = require('../../../Domains/comments/entities/DetailedComment');

/* eslint-disable no-undef */
describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const mockThread = {
      id: 'thread-123',
      title: 'thread',
      body: 'isi',
      date: '2025',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2025',
        content: 'halo',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const result = await getThreadDetailUseCase.execute(threadId);

    // Assert
    expect(mockThreadRepository.getThreadById)
      .toBeCalledWith('thread-123');

    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith('thread-123');

    expect(result).toStrictEqual({
      ...mockThread,
      comments: mockComments.map(
        (comment) => new DetailedComment(comment)
      ),
    });
  });
});