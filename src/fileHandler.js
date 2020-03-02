const fs = require('fs');
const http = require('http');
const queryString = require('querystring');
// read all of the files
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const engine = fs.readFileSync(`${__dirname}/../client/engine.html`);
const clientJs = fs.readFileSync(`${__dirname}/../client/js/index.js`);
const threeJs = fs.readFileSync(`${__dirname}/../client/js/three.module.js`);
const engineJs = fs.readFileSync(`${__dirname}/../client/js/engine.js`);
const transformControlsJs = fs.readFileSync(`${__dirname}/../client/js/TransformControls.js`);
const error404 = fs.readFileSync(`${__dirname}/../client/404.html`);
// generic helper method
const writeResponse = (request, response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(file);
  response.end();
};
const getIndex = (request, response) => {
  writeResponse(request, response, index, 'text/html');
};

const getEngine = (request, response) => {
  // gets the scene id from the query string
  const query = request.url.split('?')[1];
  const params = queryString.decode(query);
  if (!params) {
    writeResponse(request, response, error404, 'text/html');
    return;
  }
  const sceneId = params.id;
  // sends a HEAD request to /getScene. If successful, sends client
  // to the app. If not, gives a 404
  http.get({
    hostname: 'shared-world-generator.herokuapp.com',
    path: `/getScene?id=${sceneId}`,
    method: 'HEAD',
    headers: {
      Accept: 'application/json',
    },
    protocol: 'https:'
  }, (res) => {
    if (res.statusCode === 200) {
      writeResponse(request, response, engine, 'text/html');
    } else {
      writeResponse(request, response, error404, 'text/html');
    }
  });
};
const getIndexJs = (request, response) => {
  writeResponse(request, response, clientJs, 'application/javascript');
};
const getThreeJs = (request, response) => {
  writeResponse(request, response, threeJs, 'application/javascript');
};
const getEngineJs = (request, response) => {
  writeResponse(request, response, engineJs, 'application/javascript');
};
const getTransformControlsJs = (request, response) => {
  writeResponse(request, response, transformControlsJs, 'application/javascript');
};
const get404 = (request, response) => {
  writeResponse(request, response, error404, 'text/html');
};


module.exports = {
  getIndex,
  getEngine,
  getIndexJs,
  getThreeJs,
  getEngineJs,
  getTransformControlsJs,
  get404,
};
