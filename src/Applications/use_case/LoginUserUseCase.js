class LoginUserUseCase {
  constructor({
    userRepository,
    passwordHash,
    authenticationTokenManager,
    authenticationRepository,
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
    this._authenticationRepository = authenticationRepository;
  }

  async execute(useCasePayload) {
    const { username, password } = useCasePayload;

    const encryptedPassword =
      await this._userRepository.getPasswordByUsername(username);

    await this._passwordHash.comparePassword(
      password,
      encryptedPassword
    );

    const id = await this._userRepository.getIdByUsername(username);

    const accessToken =
      await this._authenticationTokenManager
        .createAccessToken({ id });

    const refreshToken =
      await this._authenticationTokenManager
        .createRefreshToken({ id });

    await this._authenticationRepository.addToken(
      refreshToken
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = LoginUserUseCase;