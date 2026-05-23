const RegisterUser = require('../RegisterUser');

/* eslint-disable no-undef */
describe('a RegisterUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload))
      .toThrowError(
        'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY'
      );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
      fullname: true,
    };

    // Action & Assert
    expect(() => new RegisterUser(payload))
      .toThrowError(
        'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'
      );
  });

  it('should create RegisterUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    // Action
    const registerUser = new RegisterUser(payload);

    // Assert
    expect(registerUser.username)
  .toEqual(payload.username);

    expect(registerUser.password)
    .toEqual(payload.password);

    expect(registerUser.fullname)
    .toEqual(payload.fullname);
  });
});