const https = require('https');
const url = require('url');
const fileHandler = require('./fileHandler');
const sceneHandler = require('./sceneHandler');
const fs = require('fs');
const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  switch (parsedUrl.pathname) {
    case '/':
      fileHandler.getIndex(request, response);
      break;
    case '/engine':
      fileHandler.getEngine(request, response);
      break;
    case '/index.js':
      fileHandler.getIndexJs(request, response);
      break;
    case '/three.module.js':
      fileHandler.getThreeJs(request, response);
      break;
    case '/new':
      sceneHandler.getNewId(request, response);
      break;
    case '/addOrUpdateScene':
      sceneHandler.addOrUpdateScene(request, response);
      break;
    case '/getScene':
      sceneHandler.getScene(request, response);
      break;
    case '/engine.js':
      fileHandler.getEngineJs(request, response);
      break;
    case '/TransformControls.js':
      fileHandler.getTransformControlsJs(request, response);
      break;
    case '/404':
      fileHandler.get404(request, response);
      break;
    case '/VRButton.js':
      fileHandler.getVRButton(request, response);
      break;
    case '/PointerLockControls.js':
      fileHandler.getPointerLockControls(request, response);
      break;
    case '/SessionHandler.js':
      fileHandler.getSessionHandler(request, response);
      break;
    case '/GLTFLoader.js':
      fileHandler.getGLTFLoader(request, response);
      break;
    case '/XRControllerModelFactory.js':
      fileHandler.getXRControllerModelFactory(request, response);
      break;
    case '/motion-controllers.module.js':
      fileHandler.getMotionControllers(request, response);
      break;
    default:
      fileHandler.getIndex(request, response);
      break;
  }
};

const options = {
  key: fs.readFileSync(`${__dirname}/../key.pem`),
  cert: fs.readFileSync(`${__dirname}/../cert.pem`)
};

https.createServer(options, onRequest).listen(port);
