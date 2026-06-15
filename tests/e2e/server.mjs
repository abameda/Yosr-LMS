import { createServer } from "node:http";

import next from "next";

const hostname = "127.0.0.1";
const requestedPort = Number(process.env.PLAYWRIGHT_SERVER_PORT ?? 3100);
const application = next({
  dev: true,
  dir: process.cwd(),
  hostname,
  port: requestedPort,
});

await application.prepare();

const requestHandler = application.getRequestHandler();
const httpServer = createServer((request, response) => {
  void requestHandler(request, response);
});
const sockets = new Set();

httpServer.on("connection", (socket) => {
  sockets.add(socket);
  socket.once("close", () => sockets.delete(socket));
});

await new Promise((resolve, reject) => {
  httpServer.once("error", reject);
  httpServer.listen(requestedPort, hostname, resolve);
});

const address = httpServer.address();
if (!address || typeof address === "string") {
  throw new Error("Playwright server did not expose a TCP address.");
}

process.send?.({
  type: "ready",
  url: `http://${hostname}:${address.port}`,
});

let closing = false;

async function close() {
  if (closing) {
    return;
  }

  closing = true;
  const serverClosed = new Promise((resolve, reject) => {
    httpServer.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
  for (const socket of sockets) {
    socket.destroy();
  }

  await serverClosed;
  await application.close();
  process.exit(0);
}

process.on("message", (message) => {
  if (message?.type === "close") {
    void close().catch((error) => {
      console.error(error);
      process.exit(1);
    });
  }
});

process.on("disconnect", () => {
  void close().catch(() => process.exit(1));
});
