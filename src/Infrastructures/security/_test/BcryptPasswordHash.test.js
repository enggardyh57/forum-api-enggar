/* eslint-disable no-undef */

const bcrypt = require('bcrypt');

const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash();

      // Action
      const encryptedPassword = await bcryptPasswordHash
        .hash('secret_password');

      // Assert
      expect(encryptedPassword)
        .not
        .toEqual('secret_password');

      const compareResult = await bcrypt.compare(
        'secret_password',
        encryptedPassword,
      );

      expect(compareResult).toBe(true);
    });
  });

  describe('comparePassword function', () => {
    it('should not throw AuthenticationError when password match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash();

      const encryptedPassword = await bcrypt.hash(
        'secret_password',
        10,
      );

      // Action & Assert
      await expect(
        bcryptPasswordHash.comparePassword(
          'secret_password',
          encryptedPassword,
        ),
      ).resolves.not.toThrow(AuthenticationError);
    });

    it('should throw AuthenticationError when password does not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash();

      const encryptedPassword = await bcrypt.hash(
        'secret_password',
        10,
      );

      // Action & Assert
      await expect(
        bcryptPasswordHash.comparePassword(
          'wrong_password',
          encryptedPassword,
        ),
      ).rejects.toThrow(AuthenticationError);
    });
  });
});