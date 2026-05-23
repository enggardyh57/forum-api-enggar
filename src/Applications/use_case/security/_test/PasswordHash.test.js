const PasswordHash = require('../PasswordHash');

/* eslint-disable no-undef */
describe('PasswordHash interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const passwordHash = new PasswordHash();

    // Action & Assert
    await expect(
      passwordHash.hash('secret')
    ).rejects.toThrowError(
      'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'
    );

    await expect(
      passwordHash.comparePassword(
        'secret',
        'encrypted_password'
      )
    ).rejects.toThrowError(
      'PASSWORD_HASH.METHOD_NOT_IMPLEMENTED'
    );
  });
});