import { nanoid } from "nanoid";
import { decode } from "querystring";
import http, { RequestListener } from "http";
// the storage for the api
const scenes: Record<string, string> = {};

const writeResponse = (
  request: http.IncomingMessage,
  response: http.ServerResponse,
  status: number,
  contentType: string,
  message = ""
) => {
  response.writeHead(status, { "Content-Type": contentType });
  if (request.method !== "HEAD") {
    response.write(message);
  }
  response.end();
};

// sends a new id with shortid
const getNewId: http.RequestListener = (request, response) => {
  if (request.headers.accept !== "text/plain") {
    writeResponse(request, response, 400, "text/plain", "Bad Request");
    return;
  }
  const newID = nanoid();
  scenes[newID] = "[]";
  writeResponse(request, response, 200, "text/plain", newID);
};

const queryScene = (scene: string): boolean => {
  return !!scenes[scene];
};

const writeBadRequest: RequestListener = (request, response) => {
      writeResponse(
      request,
      response,
      400,
      "application/json",
      '{"message": "Bad Request"}'
    );
} 

// gets a scene from the scenes object by using the id param
// in the query as a key
const getScene: http.RequestListener = (request, response) => {
  if (request.headers.accept !== "application/json" || request.url === undefined) {
    writeBadRequest(request, response);
    return;
  }
  const query = request.url.split("?")[1];
  const params = decode(query);
  const sceneId = params.id;
  if (sceneId === undefined || Array.isArray(sceneId)) {
    writeBadRequest(request, response);
    return;
  }
  if (queryScene(sceneId)) {
    writeResponse(request, response, 200, "application/json", scenes[sceneId]);
  } else {
    writeResponse(
      request,
      response,
      404,
      "application/json",
      '{"exists": "false"}'
    );
  }
};

const addOrUpdateScene: http.RequestListener = (request, response) => {
  let bodyBuffers: Buffer[] = [];
  request
    .on("data", (chunk) => {
      bodyBuffers.push(chunk);
    })
    .on("end", () => {
      let body = Buffer.concat(bodyBuffers).toString();
      const pairs = body.split("&");
      // id is the first pair, the scene entities are the second
      const id = pairs[0].split("=")[1];
      // if they do not have a scene, it is a bad request
      if (!pairs[1]) {
        writeResponse(
          request,
          response,
          400,
          "application/json",
          "{'message': 'Bad Request'}"
        );
        return;
      }
      // get the second parameter
      const scene = pairs[1].split("=")[1];
      let statusCode;
      let message;
      // if the scene exists, send 204. If not, send 201
      if (scenes[id]) {
        statusCode = 204;
        message = "Updated";
      } else {
        statusCode = 201;
        message = "Created";
      }
      scenes[id] = scene;
      writeResponse(
        request,
        response,
        statusCode,
        "application/json",
        `{"message": "${message}"}`
      );
    });
};

export default {
  getNewId,
  addOrUpdateScene,
  getScene,
  queryScene,
  writeBadRequest
};
