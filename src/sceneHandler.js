const shortid = require('shortid');
const queryString = require('querystring');

const scenes = {};

const getNewId = (request, response) => {
  if (request.headers['accept'] != 'text/plain') {
    response.writeHead(400);
    response.write('Bad Request');
    response.end();
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(shortid.generate());
  response.end();
};

const getScene = (request, response) => {
  if (request.headers['accept'] != "application/json") {
    response.writeHead(400);
    response.write('{"message": "Bad Request"}');
    response.end();
    return;
  }
  const query = request.url.split('?')[1];
  const params = queryString.decode(query);
  const sceneId = params.id;
  const scene = scenes[sceneId];
  if (scene) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(scene);
    response.end();
  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.write('{"errorCode": "Scene not found"}');
    response.end();
  }
};

const addOrUpdateScene = (request, response) => {
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    const pairs = body.split('&');
    // id is the first pair, the scene entities are the second
    const id = pairs[0].split('=')[1];
    const scene = pairs[1].split('=')[1];
    scenes[id] = scene;
    response.writeHead(204, { 'Content-Type': 'application/json' });
    response.write('{"message": "Updated"}');
    response.end();
  });
};

module.exports = {
  getNewId,
  addOrUpdateScene,
  getScene,
};
