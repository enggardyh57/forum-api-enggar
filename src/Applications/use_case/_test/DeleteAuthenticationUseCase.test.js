const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');

/* eslint-disable no-undef */
describe('DeleteAuthenticationUseCase', () => {
  it('should orchestrating the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository =
      new AuthenticationRepository();

    mockAuthenticationRepository.checkAvailabilityToken =
      jest.fn().mockImplementation(() => Promise.resolve());

    mockAuthenticationRepository.deleteToken =
      jest.fn().mockImplementation(() => Promise.resolve());

    const deleteAuthenticationUseCase =
      new DeleteAuthenticationUseCase({
        authenticationRepository:
          mockAuthenticationRepository,
      });

    // Action
    await deleteAuthenticationUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toBeCalledWith('refresh_token');

    expect(
      mockAuthenticationRepository.deleteToken
    ).toBeCalledWith('refresh_token');
  });
});