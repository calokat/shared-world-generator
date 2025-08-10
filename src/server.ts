import http from "http";
import fileHandler from "./fileHandler.js";
import sceneHandler from "./sceneHandler.js";

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest: http.RequestListener = (request, response) => {
  if (request.url === undefined) {
    fileHandler.getIndex(request, response);
    return;
  }
  if (request.url?.startsWith("/engine") && !request.url.endsWith(".js")) {
    fileHandler.getEngine(request, response);
  } else if (request.url?.startsWith("/addOrUpdateScene")) {
    sceneHandler.addOrUpdateScene(request, response);
  }
  else if (request.url?.startsWith("/getScene")) {
    sceneHandler.getScene(request, response);
  }
  else {
    switch (request.url) {
      case "/":
        fileHandler.getIndex(request, response);
        break;
      case "/index.js":
        fileHandler.getIndexJs(request, response);
        break;
      case "/three.module.js":
        fileHandler.getThreeJs(request, response);
        break;
      case "/new":
        sceneHandler.getNewId(request, response);
        break;
      case "/engine.js":
        fileHandler.getEngineJs(request, response);
        break;
      case "/TransformControls.js":
        fileHandler.getTransformControlsJs(request, response);
        break;
      default:
        fileHandler.getIndex(request, response);
        break;
    }
  }
};

http.createServer(onRequest).listen(port);
