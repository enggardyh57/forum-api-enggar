
const AuthenticationTokenManager = require('../../Applications/use_case/security/AuthenticationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.token.generate(
      payload,
      process.env.ACCESS_TOKEN_KEY
    );
  }

  async createRefreshToken(payload) {
    return this._jwt.token.generate(
      payload,
      process.env.REFRESH_TOKEN_KEY
    );
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.token.decode(token);

      this._jwt.token.verifySignature(
        artifacts,
        process.env.REFRESH_TOKEN_KEY
      );

      return artifacts.decoded.payload;
    } catch  {
      throw new InvariantError('refresh token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.token.decode(token);

    return artifacts.decoded.payload;
  }
}

module.exports = JwtTokenManager;