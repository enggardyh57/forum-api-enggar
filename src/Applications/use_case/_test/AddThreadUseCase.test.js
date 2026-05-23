const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

/* eslint-disable no-undef */
describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'isi thread',
    owner: 'user-123',
    };

    const owner = 'user-123';

    const mockAddedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(
      useCasePayload,
      owner
    );

    // Assert
    expect(addedThread).toStrictEqual(mockAddedThread);

    expect(mockThreadRepository.addThread)
      .toBeCalledWith({
        title: 'sebuah thread',
        body: 'isi thread',
        owner: 'user-123',
      });
  });
});