class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler =
      this.postCommentHandler.bind(this);

    this.deleteCommentHandler =
      this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(
      'AddCommentUseCase'
    );

    const addedComment = await addCommentUseCase.execute({
      content: request.payload.content,
      owner: request.auth.credentials.id,
      threadId: request.params.threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);

    return response;
  }

  async deleteCommentHandler(request) {
    const deleteCommentUseCase =
      this._container.getInstance(
        'DeleteCommentUseCase'
      );

    await deleteCommentUseCase.execute({
      threadId: request.params.threadId,
      commentId: request.params.commentId,
      owner: request.auth.credentials.id,
    });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;