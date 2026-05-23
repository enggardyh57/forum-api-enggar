const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../Applications/use_case/security/AuthenticationTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

/* eslint-disable no-undef */
describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};

    const refreshAuthenticationUseCase =
      new RefreshAuthenticationUseCase({
        authenticationRepository:
          new AuthenticationRepository(),
        authenticationTokenManager:
          new AuthenticationTokenManager(),
      });

    // Action & Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN'
    );
  });

  it('should throw error when refresh token not string', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: true,
    };

    const refreshAuthenticationUseCase =
      new RefreshAuthenticationUseCase({
        authenticationRepository:
          new AuthenticationRepository(),
        authenticationTokenManager:
          new AuthenticationTokenManager(),
      });

    // Action & Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrowError(
      'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw InvariantError when refresh token not available', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository =
      new AuthenticationRepository();

    const mockAuthenticationTokenManager =
      new AuthenticationTokenManager();

    mockAuthenticationTokenManager.verifyRefreshToken =
      jest.fn().mockImplementation(() => Promise.resolve());

    mockAuthenticationRepository.checkAvailabilityToken =
      jest.fn().mockImplementation(() => {
        throw new Error('token not found');
      });

    const refreshAuthenticationUseCase =
      new RefreshAuthenticationUseCase({
        authenticationRepository:
          mockAuthenticationRepository,
        authenticationTokenManager:
          mockAuthenticationTokenManager,
      });

    // Action & Assert
    await expect(
      refreshAuthenticationUseCase.execute(useCasePayload)
    ).rejects.toThrow(InvariantError);
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    const mockAuthenticationRepository =
      new AuthenticationRepository();

    const mockAuthenticationTokenManager =
      new AuthenticationTokenManager();

    mockAuthenticationTokenManager.verifyRefreshToken =
      jest.fn().mockImplementation(() => Promise.resolve());

    mockAuthenticationRepository.checkAvailabilityToken =
      jest.fn().mockImplementation(() => Promise.resolve());

    mockAuthenticationTokenManager.decodePayload =
      jest.fn().mockImplementation(() => Promise.resolve({
        id: 'user-123',
      }));

    mockAuthenticationTokenManager.createAccessToken =
      jest.fn().mockImplementation(() => Promise.resolve(
        'new_access_token'
      ));

    const refreshAuthenticationUseCase =
      new RefreshAuthenticationUseCase({
        authenticationRepository:
          mockAuthenticationRepository,
        authenticationTokenManager:
          mockAuthenticationTokenManager,
      });

    // Action
    const accessToken =
      await refreshAuthenticationUseCase.execute(
        useCasePayload
      );

    // Assert
    expect(
      mockAuthenticationTokenManager.verifyRefreshToken
    ).toBeCalledWith('refresh_token');

    expect(
      mockAuthenticationRepository.checkAvailabilityToken
    ).toBeCalledWith('refresh_token');

    expect(
      mockAuthenticationTokenManager.decodePayload
    ).toBeCalledWith('refresh_token');

    expect(
      mockAuthenticationTokenManager.createAccessToken
    ).toBeCalledWith({
      id: 'user-123',
    });

    expect(accessToken).toStrictEqual({
      accessToken: 'new_access_token',
    });
  });
});