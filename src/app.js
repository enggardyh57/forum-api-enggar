require('dotenv').config();

const container = require('./Infrastructures/container');
const createServer = require('./Infrastructures/http/createServer');

const init = async () => {
  const server = await createServer(container);

  await server.start();

  console.log(`server berjalan pada ${server.info.uri}`);
};

init();