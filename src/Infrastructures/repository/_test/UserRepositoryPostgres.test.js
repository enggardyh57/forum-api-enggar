const pool = require('../../database/postgres/pool');

const UsersTableTestHelper =
  require('../../../../test/UsersTableTestHelper');

const UserRepositoryPostgres =
  require('../UserRepositoryPostgres');

const RegisterUser =
  require('../../../Domains/users/entities/RegisterUser');

const RegisteredUser =
  require('../../../Domains/users/entities/RegisteredUser');

const InvariantError =
  require('../../../Commons/exceptions/InvariantError');

/* eslint-disable no-undef */
describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw InvariantError when username not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          {}
        );

      // Action & Assert
      await expect(
        userRepositoryPostgres
          .verifyAvailableUsername(
            'dicoding'
          )
      ).rejects.toThrowError(
        InvariantError
      );
    });

    it('should not throw InvariantError when username available', async () => {
      // Arrange
      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          {}
        );

      // Action & Assert
      await expect(
        userRepositoryPostgres
          .verifyAvailableUsername(
            'dicoding'
          )
      ).resolves.not.toThrowError(
        InvariantError
      );
    });
  });

  describe('addUser function', () => {
    it('should persist registered user', async () => {
      // Arrange
      const registerUser =
        new RegisterUser({
          username: 'dicoding',
          password: 'secret',
          fullname:
            'Dicoding Indonesia',
        });

      const fakeIdGenerator =
        () => '123';

      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      await userRepositoryPostgres
        .addUser(registerUser);

      // Assert
      const users =
        await UsersTableTestHelper
          .findUsersById(
            'user-123'
          );

      expect(users)
        .toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const registerUser =
        new RegisterUser({
          username: 'dicoding',
          password: 'secret',
          fullname:
            'Dicoding Indonesia',
        });

      const fakeIdGenerator =
        () => '123';

      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          fakeIdGenerator
        );

      // Action
      const registeredUser =
        await userRepositoryPostgres
          .addUser(
            registerUser
          );

      // Assert
      expect(
        registeredUser
      ).toStrictEqual(
        new RegisteredUser({
          id: 'user-123',
          username:
            'dicoding',
          fullname:
            'Dicoding Indonesia',
        })
      );
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should return password correctly', async () => {
      // Arrange
      await UsersTableTestHelper
        .addUser({
          username:
            'dicoding',
          password:
            'secret',
        });

      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          {}
        );

      // Action
      const password =
        await userRepositoryPostgres
          .getPasswordByUsername(
            'dicoding'
          );

      // Assert
      expect(password)
        .toEqual('secret');
    });
  });

  describe('getIdByUsername function', () => {
    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper
        .addUser({
          id: 'user-123',
          username:
            'dicoding',
        });

      const userRepositoryPostgres =
        new UserRepositoryPostgres(
          pool,
          {}
        );

      // Action
      const userId =
        await userRepositoryPostgres
          .getIdByUsername(
            'dicoding'
          );

      // Assert
      expect(userId)
        .toEqual(
          'user-123'
        );
    });
  });
});