class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler =
    this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    
    const addThreadUseCase = this._container.getInstance('AddThreadUseCase');
   

    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner: request.auth.credentials.id,
    });
     

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });

    response.code(201);

    return response;
  }
  async getThreadByIdHandler(request) {
  const getThreadDetailUseCase =
    this._container.getInstance(
      'GetThreadDetailUseCase'
    );

  const thread =
    await getThreadDetailUseCase.execute(
      request.params.threadId
    );

  return {
    status: 'success',
    data: {
      thread,
    },
  };
}
}

module.exports = ThreadsHandler;