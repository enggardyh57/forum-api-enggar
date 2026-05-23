const DetailedComment = require('../../Domains/comments/entities/DetailedComment');

class GetThreadDetailUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread =
      await this._threadRepository.getThreadById(threadId);

    const comments =
      await this._commentRepository.getCommentsByThreadId(
        threadId
      );

    const detailedComments = comments.map(
      (comment) => new DetailedComment(comment),
    );

    return {
      ...thread,
      comments: detailedComments,
    };
  }
}

module.exports = GetThreadDetailUseCase;