import { readFileSync } from "fs";
import { decode } from "querystring";
import sceneHandler from "./sceneHandler.js";
import http from "node:http";
// read all of the files
const index = readFileSync(`${__dirname}/../client/index.html`);
const engine = readFileSync(`${__dirname}/../client/engine.html`);
const clientJs = readFileSync(`${__dirname}/../client/js/index.js`);
const threeJs = readFileSync(`${__dirname}/../client/js/three.module.js`);
const engineJs = readFileSync(`${__dirname}/../client/js/engine.js`);
const transformControlsJs = readFileSync(
  `${__dirname}/../client/js/TransformControls.js`
);
const error404 = readFileSync(`${__dirname}/../client/404.html`);
// generic helper method
const writeFileResponse = (_request: http.IncomingMessage, response: http.ServerResponse, file: NonSharedBuffer, contentType: string) => {
  response.writeHead(200, { "Content-Type": contentType });
  response.write(file);
  response.end();
};

const getIndex: http.RequestListener = (request, response) => {
  writeFileResponse(request, response, index, "text/html");
};

const getEngine: http.RequestListener = (request, response) => {
  // gets the scene id from the query string
  const query = request.url?.split("?")[1];
  if (query === undefined) {
    writeFileResponse(request, response, engine, "text/html");
    return;
  }
  const params = decode(query);
  if (!params) {
    writeFileResponse(request, response, error404, "text/html");
    return;
  }
  const sceneId = params.id;
  if (sceneId === undefined || Array.isArray(sceneId)) {
    sceneHandler.writeBadRequest(request, response);
    return;
  }
  if (sceneHandler.queryScene(sceneId)) {
    writeFileResponse(request, response, engine, "text/html");
  } else {
    writeFileResponse(request, response, error404, "text/html");
  }
};
const getIndexJs: http.RequestListener = (request, response) => {
  writeFileResponse(request, response, clientJs, "application/javascript");
};
const getThreeJs: http.RequestListener = (request, response) => {
  writeFileResponse(request, response, threeJs, "application/javascript");
};
const getEngineJs: http.RequestListener = (request, response) => {
  writeFileResponse(request, response, engineJs, "application/javascript");
};
const getTransformControlsJs: http.RequestListener = (request, response) => {
  writeFileResponse(
    request,
    response,
    transformControlsJs,
    "application/javascript"
  );
};
const get404: http.RequestListener = (request, response) => {
  writeFileResponse(request, response, error404, "text/html");
};

export default {
  getIndex,
  getEngine,
  getIndexJs,
  getThreeJs,
  getEngineJs,
  getTransformControlsJs,
  get404,
};
