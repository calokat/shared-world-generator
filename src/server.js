const http = require('http');
const url = require('url');
const fileHandler = require('./fileHandler');
const sceneHandler = require('./sceneHandler')
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
    case '/three.js':
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
    default:
        fileHandler.getIndex(request, response);
        break;
  }
};

http.createServer(onRequest).listen(port);
