const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const onPreResponseError = require('./_errors');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');


const createServer = async container => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
  });

  const rateLimiter = new RateLimiterMemory({
  points: 90,
  duration: 60,
});

server.ext('onRequest', async (request, h) => {
  if (request.path.startsWith('/threads')) {
    try {
      await rateLimiter.consume(request.info.remoteAddress);
    } catch {
      return h.response({
        status: 'fail',
        message: 'Too many requests',
      }).code(429).takeover();
    }
  }

  return h.continue;
});
  

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  await server.register({
  plugin: users,
  options: {
    container,
  },
});

await server.register({
  plugin: authentications,
  options: {
    container,
  },
});

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: artifacts => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register({
    plugin: threads,
    options: {
      container,
    },
  });

  await server.register({
  plugin: comments,
  options: {
    container,
  },
});
server.route({
  method: 'GET',
  path: '/',
  handler: () => ({
    status: 'success',
    message: 'Forum API running',
  }),
});
server.ext('onPreResponse', onPreResponseError);



  return server;
};

module.exports = createServer;