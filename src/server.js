const http = require('http');
const fileHandler = require('./fileHandler');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
    switch (request.url) {
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
        default:
            fileHandler.getIndex(request, response);
            break;
  }
};

http.createServer(onRequest).listen(port);
