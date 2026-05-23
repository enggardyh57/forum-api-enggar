const AddUserUseCase = require('../AddUserUseCase');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../../Applications/use_case/security/PasswordHash');

/* eslint-disable no-undef */
describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    const mockRegisteredUser = {
      id: 'user-123',
      username: 'dicoding',
      fullname: 'Dicoding Indonesia',
    };

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));

    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await addUserUseCase.execute(
      useCasePayload
    );

    // Assert
    expect(mockUserRepository.verifyAvailableUsername)
      .toBeCalledWith('dicoding');

    expect(mockPasswordHash.hash)
      .toBeCalledWith('secret');

    expect(mockUserRepository.addUser)
      .toBeCalledWith({
        username: 'dicoding',
        password: 'encrypted_password',
        fullname: 'Dicoding Indonesia',
      });

    expect(registeredUser)
      .toStrictEqual(mockRegisteredUser);
  });
});