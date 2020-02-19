const shortid = require('shortid');
const url = require('url');
const queryString = require('querystring');
const scenes = {};

const getNewId = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.write(shortid.generate());
  response.end();
};

const getScene = (request, response) => {
  let query = request.url.split('?')[1];
  let params = queryString.decode(query);
  let sceneId = params.id;
  let scene = scenes[sceneId];
  if (scene){
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(scene);
    response.end();
  }
  else {
    response.writeHead(404, {'Content-Type': 'application/json'});
    response.write('{"errorCode": "Scene not found"}');
    response.end();
  }
}

const addOrUpdateScene = (request, response) => {
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    let pairs = body.split('&');
    // id is the first pair, the scene entities are the second
    let id = pairs[0].split('=')[1];
    let scene = pairs[1].split('=')[1];
    scenes[id] = scene;
  })
};

module.exports = {
  getNewId,
  addOrUpdateScene,
  getScene
};
