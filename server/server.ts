import * as hs from "http-server";
import { Logger } from "./logger";
import express = require("express");
import { IncomingMessage, ServerResponse } from "http";
import { ServerStore } from "./serverStore";
import * as path from "path";
import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
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

  httpServer.use(express.static(path.join(__dirname, "..")));
  httpServer.listen(8001);

  const dataFileServer = hs.createServer({
    root: rootFolder,
    proxy: "http://127.0.0.1:8001/",
    showDir: "false",
    autoIndex: "false",
    username: username,
    password: password,
  });

  dataFileServer.listen(8000);

  console.log("server started");
}
