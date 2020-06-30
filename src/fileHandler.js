const fs = require('fs');
const sceneHandler = require('./sceneHandler');
// read all of the files
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const engine = fs.readFileSync(`${__dirname}/../client/engine.html`);
const clientJs = fs.readFileSync(`${__dirname}/../client/js/index.js`);
const threeJs = fs.readFileSync(`${__dirname}/../client/js/three/build/three.module.js`);
const engineJs = fs.readFileSync(`${__dirname}/../client/js/engine.js`);
const transformControlsJs = fs.readFileSync(`${__dirname}/../client/js/three/controls/TransformControls.js`);
const error404 = fs.readFileSync(`${__dirname}/../client/404.html`);
const VRButton = fs.readFileSync(`${__dirname}/../client/js/three/webxr/VRButton.js`);
const pointerLockControls = fs.readFileSync(`${__dirname}/../client/js/three/controls/PointerLockControls.js`);
const sessionHandler = fs.readFileSync(`${__dirname}/../client/js/SessionHandler.js`);
const xrControllerModelFactory = fs.readFileSync(`${__dirname}/../client/js/three/webxr/XRControllerModelFactory.js`);
const gltfLoader = fs.readFileSync(`${__dirname}/../client/js/three/loader/GLTFLoader.js`);
const motionControllers = fs.readFileSync(`${__dirname}/../client/js/three/libs/motion-controllers.module.js`)
// generic helper method
const writeResponse = (request, response, file, contentType) => {
  response.writeHead(200, { 'Content-Type': contentType });
  response.write(file);
  response.end();
};
const getIndex = (request, response) => {
  writeResponse(request, response, index, 'text/html');
};
// if the scene id from the request query is in the api, go to the app. If not, go to the error page
const getEngine = (request, response) => {
  if (sceneHandler.doesSceneExist(request)) {
    writeResponse(request, response, engine, 'text/html');
  } else {
    writeResponse(request, response, error404, 'text/html');
  }
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
const getVRButton = (request, response) => {
  writeResponse(request, response, VRButton, 'application/javascript');
};
const getPointerLockControls = (request, response) => {
  writeResponse(request, response, pointerLockControls, 'application/javascript');
};
const getSessionHandler = (request, response) => {
  writeResponse(request, response, sessionHandler, 'application/javascript');
};
const getXRControllerModelFactory = (request, response) => {
  writeResponse(request, response, xrControllerModelFactory, 'application/javascript');
};
const getGLTFLoader = (request, response) => {
  writeResponse(request, response, gltfLoader, 'application/javascript');
};
const getMotionControllers = (request, response) => {
  writeResponse(request, response, motionControllers, 'application/javascript');
};




module.exports = {
  getIndex,
  getEngine,
  getIndexJs,
  getThreeJs,
  getEngineJs,
  getTransformControlsJs,
  get404,
  getVRButton,
  getPointerLockControls,
  getSessionHandler,
  getXRControllerModelFactory,
  getGLTFLoader,
  getMotionControllers,
};
