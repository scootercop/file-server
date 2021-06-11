import * as hs from "http-server";
import { Logger } from "./logger";
import express = require("express");
import { IncomingMessage, ServerResponse } from "http";
import { ServerStore } from "./serverStore";

const cliArguments = process.argv.slice(2);
const rootFolder = cliArguments[0];
const username = cliArguments[1];
const password = cliArguments[2];
const httpServer = express();
httpServer.use(Logger);
httpServer.get(
  "/FSD",
  function (
    request: IncomingMessage,
    response: ServerResponse,
    next: Function
  ) {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(ServerStore.fileFolderStructure));
    next();
  }
);

httpServer.use(express.static(".."));
httpServer.listen(8081);

const dataFileServer = hs.createServer({
  root: rootFolder,
  proxy: "http://127.0.0.1:8081/",
  showDir: "false",
  autoIndex: "false",
  username: username,
  password: password,
});

dataFileServer.listen(8080);

console.log("server started");
