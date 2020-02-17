const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const engine = fs.readFileSync(`${__dirname}/../client/engine.html`);
const clientJs = fs.readFileSync(`${__dirname}/../client/js/index.js`);
const threeJs = fs.readFileSync(`${__dirname}/../client/js/three.js`);
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getEngine = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(engine);
    response.end();
  };  
const getIndexJs = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.write(clientJs);
    response.end();
};  
const getThreeJs = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/javascript' });
    response.write(threeJs);
    response.end();
};  


module.exports = {
  getIndex,
  getEngine,
  getIndexJs,
  getThreeJs
};
