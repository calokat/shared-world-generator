import fileHandler from "./fileHandler.js";
import sceneHandler from "./sceneHandler.js";
import express from "express";

const app = express();

app.get("/", (req, res) => {
  fileHandler.getIndex(req, res);
});

app.get("/engine", (req, res) => {
  fileHandler.getEngine(req, res);
});

app.post("/addOrUpdateScene", (req, res) => {
  sceneHandler.addOrUpdateScene(req, res);
});

app.get("/getScene", (req, res) => {
  sceneHandler.getScene(req, res);
});

app.get("/new", (req, res) => {
  sceneHandler.getNewId(req, res);
});

app.use(express.static(`${__dirname}/../client`));

const port = process.env.PORT || process.env.NODE_PORT || 3000;

app.listen(port);
