const http = require('http');

const app = require('./server');
const config = require('./server/config');
const logger = require("./server/logger");

const {
  hostname,
  port,
} = config.server;

const server = http.createServer(app);

server.listen(port, hostname, () => {
  logger.info(`Server running at http://${hostname}:${port}/`);
});
