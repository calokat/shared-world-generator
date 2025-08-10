import { nanoid } from "nanoid";
import { decode } from "querystring";
import { createClient } from "redis";
const redisClient = createClient({ url: process.env.REDIS_URL }).connect();
const writeResponse = (request, response, status, contentType, message = "") => {
    response.writeHead(status, { "Content-Type": contentType });
    if (request.method !== "HEAD") {
        response.write(message);
    }
    response.end();
};
// sends a new id with shortid
const getNewId = async (request, response) => {
    if (request.headers.accept !== "text/plain") {
        writeResponse(request, response, 400, "text/plain", "Bad Request");
        return;
    }
    const newID = nanoid();
    (await redisClient).set(newID, "[]");
    writeResponse(request, response, 200, "text/plain", newID);
};
const queryScene = async (scene) => {
    const foundScene = await (await redisClient).get(scene);
    return foundScene !== null;
};
const writeBadRequest = (request, response) => {
    writeResponse(request, response, 400, "application/json", '{"message": "Bad Request"}');
};
// gets a scene from the scenes object by using the id param
// in the query as a key
const getScene = async (request, response) => {
    if (request.headers.accept !== "application/json" ||
        request.url === undefined) {
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
    const scene = await (await redisClient).get(sceneId);
    if (scene !== null) {
        writeResponse(request, response, 200, "application/json", scene);
    }
    else {
        writeResponse(request, response, 404, "application/json", '{"exists": "false"}');
    }
};
const addOrUpdateScene = (request, response) => {
    let bodyBuffers = [];
    request
        .on("data", (chunk) => {
        bodyBuffers.push(chunk);
    })
        .on("end", async () => {
        let body = Buffer.concat(bodyBuffers).toString();
        const pairs = body.split("&");
        // id is the first pair, the scene entities are the second
        const id = pairs[0].split("=")[1];
        // if they do not have a scene, it is a bad request
        if (!pairs[1]) {
            writeResponse(request, response, 400, "application/json", "{'message': 'Bad Request'}");
            return;
        }
        // get the second parameter
        const scene = pairs[1].split("=")[1];
        let statusCode;
        let message;
        // if the scene exists, send 204. If not, send 201
        let sceneData = await (await redisClient).get(id);
        if (sceneData !== null) {
            statusCode = 204;
            message = "Updated";
        }
        else {
            statusCode = 201;
            message = "Created";
        }
        await (await redisClient).set(id, scene);
        writeResponse(request, response, statusCode, "application/json", `{"message": "${message}"}`);
    });
};
export default {
    getNewId,
    addOrUpdateScene,
    getScene,
    queryScene,
    writeBadRequest,
};
