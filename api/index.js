"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fileHandler_js_1 = __importDefault(require("./fileHandler.js"));
const sceneHandler_js_1 = __importDefault(require("./sceneHandler.js"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    fileHandler_js_1.default.getIndex(req, res);
});
app.get("/engine", (req, res) => {
    fileHandler_js_1.default.getEngine(req, res);
});
app.post("/addOrUpdateScene", (req, res) => {
    sceneHandler_js_1.default.addOrUpdateScene(req, res);
});
app.get("/getScene", (req, res) => {
    sceneHandler_js_1.default.getScene(req, res);
});
app.get("/new", (req, res) => {
    sceneHandler_js_1.default.getNewId(req, res);
});
app.use(express_1.default.static(`${__dirname}/../client`));
const port = process.env.PORT || process.env.NODE_PORT || 3001;
exports.default = app;
