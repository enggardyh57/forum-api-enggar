const AuthenticationTokenManager = require('../AuthenticationTokenManager');

/* eslint-disable no-undef */
describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationTokenManager =
      new AuthenticationTokenManager();

    // Action & Assert
    await expect(
      authenticationTokenManager.createAccessToken({})
    ).rejects.toThrowError(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      authenticationTokenManager.createRefreshToken({})
    ).rejects.toThrowError(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      authenticationTokenManager.verifyRefreshToken('')
    ).rejects.toThrowError(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      authenticationTokenManager.decodePayload('')
    ).rejects.toThrowError(
      'AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'
    );
  });
});