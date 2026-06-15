// @vitest-environment node

import { request } from "node:http";
import { createConnection } from "node:net";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

import { describe, expect, it } from "vitest";

import { startPlaywrightServer } from "./playwright-server";

function getStatus(url: string) {
  return new Promise<number>((resolve, reject) => {
    const clientRequest = request(url, (response) => {
      response.resume();
      response.once("end", () => resolve(response.statusCode ?? 0));
    });

    clientRequest.once("error", reject);
    clientRequest.end();
  });
}

describe("Playwright application server", () => {
  it("starts and closes without leaving its listener open", async () => {
    const applicationServer = await startPlaywrightServer({
      environment: {
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test-value",
        NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:55321",
      },
      port: 0,
    });

    expect(applicationServer.process.exitCode).toBeNull();
    expect(await getStatus(applicationServer.url)).toBe(200);

    const applicationUrl = new URL(applicationServer.url);
    const openSocket = createConnection({
      host: applicationUrl.hostname,
      port: Number(applicationUrl.port),
    });
    await once(openSocket, "connect");

    const closePromise = applicationServer.close();
    const closedPromptly = await Promise.race([
      closePromise.then(() => true),
      delay(1_000, false),
    ]);

    openSocket.destroy();
    await closePromise;

    expect(closedPromptly).toBe(true);
    expect(applicationServer.process.exitCode).not.toBeNull();
    await expect(getStatus(applicationServer.url)).rejects.toMatchObject({
      code: "ECONNREFUSED",
    });
  }, 30_000);
});
