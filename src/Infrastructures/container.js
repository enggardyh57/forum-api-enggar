const { createContainer } = require('instances-container');
const Jwt = require('@hapi/jwt');

const { nanoid } = require('nanoid');
const pool = require('./database/postgres/pool');


const UserRepository = require('../Domains/users/UserRepository');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');

const PasswordHash = require('../Applications/use_case/security/PasswordHash');
const BcryptPasswordHash = require('../Infrastructures/security/BcryptPasswordHash');

const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');

const AuthenticationTokenManager = require('../Applications/use_case/security/AuthenticationTokenManager');
const JwtTokenManager = require('../Infrastructures/security/JwtTokenManager');

const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');

const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');

const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');

const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');

const DeleteAuthenticationUseCase = require('../Applications/use_case/DeleteAuthenticationUseCase');

const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');

const CommentRepository = require('../Domains/comments/CommentRepository');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');

const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const GetThreadDetailUseCase = require('../Applications/use_case/GetThreadDetailUseCase');

const container = createContainer();


container.register([
  // USER
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },

  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
  },

  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'passwordHash', internal: PasswordHash.name },
      ],
    },
  },

  // AUTH
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        { concrete: Jwt, internal: false },
      ],
    },
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
      ],
    },
  },

  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'userRepository', internal: UserRepository.name },
        { name: 'passwordHash', internal: PasswordHash.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
      ],
    },
  },

  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
        { name: 'authenticationTokenManager', internal: AuthenticationTokenManager.name },
      ],
    },
  },

  {
    key: DeleteAuthenticationUseCase.name,
    Class: DeleteAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'authenticationRepository', internal: AuthenticationRepository.name },
      ],
    },
  },

  // THREAD
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: pool },
        { concrete: nanoid },
      ],
    },
  },

  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        { name: 'threadRepository', internal: ThreadRepository.name },
      ],
    },
  },

  // comments
  {
  key: CommentRepository.name,
  Class: CommentRepositoryPostgres,
  parameter: {
    dependencies: [
      {
        concrete: pool,
      },
      {
        concrete: nanoid,
      },
    ],
  },
},
{
  key: AddCommentUseCase.name,
  Class: AddCommentUseCase,
  parameter: {
    injectType: 'destructuring',
    dependencies: [
      {
        name: 'threadRepository',
        internal: ThreadRepository.name,
      },
      {
        name: 'commentRepository',
        internal: CommentRepository.name,
      },
    ],
  },
},
{
  key: DeleteCommentUseCase.name,
  Class: DeleteCommentUseCase,
  parameter: {
    injectType: 'destructuring',
    dependencies: [
      {
        name: 'threadRepository',
        internal: ThreadRepository.name,
      },
      {
        name: 'commentRepository',
        internal: CommentRepository.name,
      },
    ],
  },
},
{
  key: GetThreadDetailUseCase.name,
  Class: GetThreadDetailUseCase,
  parameter: {
    injectType: 'destructuring',
    dependencies: [
      {
        name: 'threadRepository',
        internal: ThreadRepository.name,
      },
      {
        name: 'commentRepository',
        internal: CommentRepository.name,
      },
    ],
  },
},
]);

module.exports = container;