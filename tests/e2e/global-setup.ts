import { startPlaywrightServer } from "../../src/test/playwright-server";

const port = 3100;

export default async function globalSetup() {
  const applicationServer = await startPlaywrightServer({
    environment: {
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        "sb_publishable_test-value",
      NEXT_PUBLIC_SUPABASE_URL:
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:55321",
    },
    port,
  });

  return async () => {
    await applicationServer.close();
  };
}
