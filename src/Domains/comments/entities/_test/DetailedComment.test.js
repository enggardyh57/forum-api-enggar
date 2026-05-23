const DetailedComment = require('../DetailedComment');

/* eslint-disable no-undef */
describe('a DetailedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-05-22',
      content: 'sebuah komentar',
    };

    // Action & Assert
    expect(() => new DetailedComment(payload))
      .toThrowError(
        'DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should create DetailedComment object correctly when comment is not deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-05-22',
      content: 'sebuah komentar',
      is_delete: false,
    };

    // Action
    const detailedComment = new DetailedComment(payload);

    // Assert
    expect(detailedComment.id)
      .toEqual(payload.id);

    expect(detailedComment.username)
      .toEqual(payload.username);

    expect(detailedComment.date)
      .toEqual(payload.date);

    expect(detailedComment.content)
      .toEqual(payload.content);
  });

  it('should mask content when comment is deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-05-22',
      content: 'sebuah komentar',
      is_delete: true,
    };

    // Action
    const detailedComment = new DetailedComment(payload);

    // Assert
    expect(detailedComment.content)
      .toEqual('**komentar telah dihapus**');
  });
});