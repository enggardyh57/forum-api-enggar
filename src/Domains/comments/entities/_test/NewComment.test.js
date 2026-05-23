const NewComment = require('../NewComment');

/* eslint-disable no-undef */
describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError(
        'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: true,
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload))
      .toThrowError(
        'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
  });

  it('should create newComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      owner: 'user-123',
      threadId: 'thread-123',
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.content)
      .toEqual(payload.content);

    expect(newComment.owner)
      .toEqual(payload.owner);

    expect(newComment.threadId)
      .toEqual(payload.threadId);
  });
});