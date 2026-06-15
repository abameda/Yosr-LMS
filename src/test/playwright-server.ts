import { fork, type ChildProcess } from "node:child_process";
import { resolve } from "node:path";

interface StartPlaywrightServerOptions {
  port: number;
}

interface ReadyMessage {
  type: "ready";
  url: string;
}

const repositoryRoot = process.cwd();
const serverPath = resolve(repositoryRoot, "tests/e2e/server.mjs");

function waitForReady(process: ChildProcess) {
  return new Promise<ReadyMessage>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out waiting for the Playwright server."));
    }, 30_000);

    const cleanup = () => {
      clearTimeout(timeout);
      process.off("error", onError);
      process.off("exit", onExit);
      process.off("message", onMessage);
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onExit = (code: number | null) => {
      cleanup();
      reject(
        new Error(
          `Playwright server exited before readiness with code ${code}.`,
        ),
      );
    };
    const onMessage = (message: unknown) => {
      if (
        typeof message !== "object" ||
        message === null ||
        !("type" in message) ||
        message.type !== "ready" ||
        !("url" in message) ||
        typeof message.url !== "string"
      ) {
        return;
      }

      cleanup();
      resolve(message as ReadyMessage);
    };

    process.once("error", onError);
    process.once("exit", onExit);
    process.on("message", onMessage);
  });
}

function closeProcess(process: ChildProcess) {
  if (process.exitCode !== null) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Timed out closing the Playwright server."));
    }, 30_000);

    const cleanup = () => {
      clearTimeout(timeout);
      process.off("error", onError);
      process.off("exit", onExit);
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onExit = (code: number | null) => {
      cleanup();
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Playwright server exited with code ${code}.`));
    };

    process.once("error", onError);
    process.once("exit", onExit);
    process.send?.({ type: "close" }, (error) => {
      if (error) {
        onError(error);
      }
    });
  });
}

export async function startPlaywrightServer({
  port,
}: StartPlaywrightServerOptions) {
  const process = fork(serverPath, {
    cwd: repositoryRoot,
    env: {
      ...globalThis.process.env,
      NODE_ENV: "development",
      PLAYWRIGHT_SERVER_PORT: String(port),
    },
    stdio: ["ignore", "inherit", "inherit", "ipc"],
  });
  const ready = await waitForReady(process);

  return {
    process,
    url: ready.url,
    close: () => closeProcess(process),
  };
}
