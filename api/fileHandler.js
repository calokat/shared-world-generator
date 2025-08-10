"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const querystring_1 = require("querystring");
const sceneHandler_js_1 = __importDefault(require("./sceneHandler.js"));
// read all of the files
const index = (0, fs_1.readFileSync)(`${__dirname}/../client/index.html`);
const engine = (0, fs_1.readFileSync)(`${__dirname}/../client/engine.html`);
const clientJs = (0, fs_1.readFileSync)(`${__dirname}/../client/js/index.js`);
const threeJs = (0, fs_1.readFileSync)(`${__dirname}/../client/js/three.module.js`);
const engineJs = (0, fs_1.readFileSync)(`${__dirname}/../client/js/engine.js`);
const transformControlsJs = (0, fs_1.readFileSync)(`${__dirname}/../client/js/TransformControls.js`);
const error404 = (0, fs_1.readFileSync)(`${__dirname}/../client/404.html`);
// generic helper method
const writeFileResponse = (_request, response, file, contentType) => {
    response.writeHead(200, { "Content-Type": contentType });
    response.write(file);
    response.end();
};
const getIndex = (request, response) => {
    writeFileResponse(request, response, index, "text/html");
};
const getEngine = async (request, response) => {
    // gets the scene id from the query string
    const query = request.url?.split("?")[1];
    if (query === undefined) {
        writeFileResponse(request, response, engine, "text/html");
        return;
    }
    const params = (0, querystring_1.decode)(query);
    if (!params) {
        writeFileResponse(request, response, error404, "text/html");
        return;
    }
    const sceneId = params.id;
    if (sceneId === undefined || Array.isArray(sceneId)) {
        sceneHandler_js_1.default.writeBadRequest(request, response);
        return;
    }
    if (await sceneHandler_js_1.default.queryScene(sceneId)) {
        writeFileResponse(request, response, engine, "text/html");
    }
    else {
        writeFileResponse(request, response, error404, "text/html");
    }
};
const getIndexJs = (request, response) => {
    writeFileResponse(request, response, clientJs, "application/javascript");
};
const getThreeJs = (request, response) => {
    writeFileResponse(request, response, threeJs, "application/javascript");
};
const getEngineJs = (request, response) => {
    writeFileResponse(request, response, engineJs, "application/javascript");
};
const getTransformControlsJs = (request, response) => {
    writeFileResponse(request, response, transformControlsJs, "application/javascript");
};
const get404 = (request, response) => {
    writeFileResponse(request, response, error404, "text/html");
};
exports.default = {
    getIndex,
    getEngine,
    getIndexJs,
    getThreeJs,
    getEngineJs,
    getTransformControlsJs,
    get404,
};
