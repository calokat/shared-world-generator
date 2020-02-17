const shortid = require('shortid');

const scenes = {};

const getNewId = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(shortid.generate());
  response.end();
};

module.exports = {
  getNewId,
};
