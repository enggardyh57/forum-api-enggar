const pool = require('../../database/postgres/pool');

const AuthenticationsTableTestHelper =
  require('../../../../test/AuthenticationsTableTestHelper');

const AuthenticationRepositoryPostgres =
  require('../AuthenticationRepositoryPostgres');

const InvariantError =
  require('../../../Commons/exceptions/InvariantError');

/* eslint-disable no-undef */

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should persist token', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.addToken(
        'refresh_token'
      );

      // Assert
      const tokens =
        await AuthenticationsTableTestHelper.findToken(
          'refresh_token'
        );

      expect(tokens).toHaveLength(1);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError when token not available', async () => {
      // Arrange
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.checkAvailabilityToken(
          'refresh_token'
        )
      ).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when token available', async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken(
        'refresh_token'
      );

      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool);

      // Action & Assert
      await expect(
        authenticationRepositoryPostgres.checkAvailabilityToken(
          'refresh_token'
        )
      ).resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken function', () => {
    it('should delete token correctly', async () => {
      // Arrange
      await AuthenticationsTableTestHelper.addToken(
        'refresh_token'
      );

      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool);

      // Action
      await authenticationRepositoryPostgres.deleteToken(
        'refresh_token'
      );

      // Assert
      const tokens =
        await AuthenticationsTableTestHelper.findToken(
          'refresh_token'
        );

      expect(tokens).toHaveLength(0);
    });
  });
});