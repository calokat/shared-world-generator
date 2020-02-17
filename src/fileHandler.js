const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const engine = fs.readFileSync(`${__dirname}/../client/engine.html`);
const engine = fs.readFileSync(`${__dirname}/../client/engine.html`);
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
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(engine);
    response.end();
};  


module.exports = {
  getIndex,
  getEngine
};
