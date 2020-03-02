const shortid = require('shortid');
const queryString = require('querystring');
// the storage for the api
const scenes = { demo: '[{"name":"Cube","color":65280,"position":{"x":0,"y":1.4644660940672622,"z":1.4644660940672627},"rotation":{"_x":0,"_y":0,"_z":0,"_order":"XYZ"},"scale":{"x":1,"y":1,"z":1}}]' };
// helper method for writing responses
const writeResponse = (request, response, status, contentType, message = '') => {
  response.writeHead(status, { 'Content-Type': contentType });
  if (request.method !== 'HEAD') {
    response.write(message);
  }
  response.end();
};

// sends a new id with shortid
const getNewId = (request, response) => {
  if (request.headers.accept !== 'text/plain') {
    writeResponse(request, response, 400, 'text/plain', 'Bad Request');
    return;
  }
  const newID = shortid.generate();
  scenes[newID] = '[]';
  writeResponse(request, response, 200, 'text/plain', newID);
};
// checks if the scene exists, returns undefined if not
const doesSceneExist = (request) => {
  const query = request.url.split('?')[1];
  const params = queryString.decode(query);
  const sceneId = params.id;
  const scene = scenes[sceneId];
  return scene;
};

// gets a scene from the scenes object by using the id param
// in the query as a key
const getScene = (request, response) => {
  if (request.headers.accept !== 'application/json') {
    writeResponse(request, response, 400, 'application/json', '{"message": "Bad Request"}');
    return;
  }
  const scene = doesSceneExist(request);
  if (scene) {
    writeResponse(request, response, 200, 'application/json', scene);
  } else {
    writeResponse(request, response, 404, 'application/json', '{"errorCode": "Scene not found"}');
  }
};
// either adds a new scene to the api, or updates an existing one
const addOrUpdateScene = (request, response) => {
  let body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    const pairs = body.split('&');
    // id is the first pair, the scene entities are the second
    const id = pairs[0].split('=')[1];
    // if they do not have a scene, it is a bad request
    if (!pairs[1]) {
      writeResponse(request, response, 400, 'application/json', "{'message': 'Bad Request'}");
      return;
    }
    // get the second parameter
    const scene = pairs[1].split('=')[1];
    let statusCode;
    let message;
    // if the scene exists, send 204. If not, send 201
    if (scenes[id] !== '[]') {
      statusCode = 204;
      message = 'Updated';
    } else {
      statusCode = 201;
      message = 'Created';
    }
    scenes[id] = scene;
    writeResponse(request, response, statusCode, 'application/json', `{"message": "${message}"}`);
  });
};

module.exports = {
  getNewId,
  addOrUpdateScene,
  getScene,
  doesSceneExist,
};
