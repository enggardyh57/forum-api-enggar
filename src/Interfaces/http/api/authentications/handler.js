class AuthenticationsHandler {
  constructor(container) {
    this._container = container;

    this.postAuthenticationHandler =
      this.postAuthenticationHandler.bind(this);
    
          this.putAuthenticationHandler =
      this.putAuthenticationHandler.bind(this);

    this.deleteAuthenticationHandler =
      this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request, h) {
    const loginUserUseCase = this._container.getInstance(
      'LoginUserUseCase'
    );

    const token = await loginUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: token,
    });

    response.code(201);

    return response;
  }
 async putAuthenticationHandler(request, h) {
  const refreshAuthenticationUseCase =
    this._container.getInstance('RefreshAuthenticationUseCase');

  const accessToken =
    await refreshAuthenticationUseCase.execute(request.payload);

  const response = h.response({
    status: 'success',
    data: accessToken,
  });

  response.code(200);
  return response;
}

async deleteAuthenticationHandler(request, h) {
   console.log('DELETE payload:', request.payload)
  const deleteAuthenticationUseCase =
    this._container.getInstance('DeleteAuthenticationUseCase');

  await deleteAuthenticationUseCase.execute(request.payload);

  const response = h.response({
    status: 'success',
  });

  response.code(200);
  return response;
}
}

module.exports = AuthenticationsHandler;