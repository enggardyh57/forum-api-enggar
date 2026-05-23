const NewThread = require('../NewThread');

/* eslint-disable no-undef */
describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload))
      .toThrowError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      );
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: true,
      body: 'isi thread',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload))
      .toThrowError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      );
  });

  it('should create NewThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'isi thread',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});