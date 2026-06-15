import { startPlaywrightServer } from "../../src/test/playwright-server";

const port = 3100;

export default async function globalSetup() {
  const applicationServer = await startPlaywrightServer({ port });

  return async () => {
    await applicationServer.close();
  };
}
