const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

/* eslint-disable no-undef */
describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah comment',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const mockAddedComment = {
      id: 'comment-123',
      content: 'sebuah comment',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(mockThreadRepository.verifyThreadExists)
      .toBeCalledWith('thread-123');

    expect(mockCommentRepository.addComment)
      .toBeCalledWith({
        content: 'sebuah comment',
        threadId: 'thread-123',
        owner: 'user-123',
      });

    expect(addedComment)
      .toStrictEqual(mockAddedComment);
  });
});