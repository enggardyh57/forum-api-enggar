const bcrypt = require('bcrypt');
const PasswordHash = require('../../Applications/use_case/security/PasswordHash');
const AuthenticationError = require('../../Commons/exceptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  async hash(password) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      throw new AuthenticationError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada');
    }
  }
}

module.exports = BcryptPasswordHash;