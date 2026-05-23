const LoginUserUseCase = require('../LoginUserUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../../Applications/use_case/security/PasswordHash');
const AuthenticationTokenManager = require('../../../Applications/use_case/security/AuthenticationTokenManager');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');

/* eslint-disable no-undef */
describe('LoginUserUseCase', () => {
  it('should orchestrating the login action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockAuthenticationTokenManager =
      new AuthenticationTokenManager();
    const mockAuthenticationRepository =
      new AuthenticationRepository();

    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));

    mockAuthenticationTokenManager.createAccessToken =
      jest.fn()
        .mockImplementation(() => Promise.resolve('access_token'));

    mockAuthenticationTokenManager.createRefreshToken =
      jest.fn()
        .mockImplementation(() => Promise.resolve('refresh_token'));

    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      authenticationTokenManager:
        mockAuthenticationTokenManager,
      authenticationRepository:
        mockAuthenticationRepository,
    });

    // Action
    const auth = await loginUserUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(mockUserRepository.getPasswordByUsername)
      .toBeCalledWith('dicoding');

    expect(mockPasswordHash.comparePassword)
      .toBeCalledWith(
        'secret',
        'encrypted_password'
      );

    expect(mockUserRepository.getIdByUsername)
      .toBeCalledWith('dicoding');

    expect(
      mockAuthenticationTokenManager.createAccessToken
    ).toBeCalledWith({
      id: 'user-123',
    });

    expect(
      mockAuthenticationTokenManager.createRefreshToken
    ).toBeCalledWith({
      id: 'user-123',
    });

    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith('refresh_token');

    expect(auth).toStrictEqual({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });
  });
});