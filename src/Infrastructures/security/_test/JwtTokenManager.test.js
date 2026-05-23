/* eslint-disable no-undef */

const Jwt = require('@hapi/jwt');

const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('JwtTokenManager', () => {
  const jwtTokenManager = new JwtTokenManager(Jwt);

  const payload = {
    username: 'dicoding',
    id: 'user-123',
  };

  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // Action
      const accessToken = await jwtTokenManager
        .createAccessToken(payload);

      // Assert
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toEqual('string');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      // Action
      const refreshToken = await jwtTokenManager
        .createRefreshToken(payload);

      // Assert
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toEqual('string');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when refresh token is invalid', async () => {
      // Arrange
      const invalidToken = 'invalid_token';

      // Action & Assert
      await expect(
        jwtTokenManager.verifyRefreshToken(
          invalidToken,
        ),
      ).rejects.toThrow(InvariantError);
    });

    it('should return token payload correctly', async () => {
      // Arrange
      const refreshToken = await jwtTokenManager
        .createRefreshToken(payload);

      // Action
      const decodedPayload = await jwtTokenManager
        .verifyRefreshToken(refreshToken);

      // Assert
      expect(decodedPayload.username)
        .toEqual(payload.username);

      expect(decodedPayload.id)
        .toEqual(payload.id);
    });
  });

  describe('decodePayload function', () => {
    it('should decode token payload correctly', async () => {
      // Arrange
      const accessToken = await jwtTokenManager
        .createAccessToken(payload);

      // Action
      const decodedPayload = await jwtTokenManager
        .decodePayload(accessToken);

      // Assert
      expect(decodedPayload.username)
        .toEqual(payload.username);

      expect(decodedPayload.id)
        .toEqual(payload.id);
    });
  });
});