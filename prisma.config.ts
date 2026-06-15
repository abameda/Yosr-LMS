import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: [".env.local", ".env"], quiet: true });

const directUrl = process.env.DIRECT_URL;
const shadowDatabaseUrl = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: directUrl
    ? {
        url: directUrl,
        ...(shadowDatabaseUrl ? { shadowDatabaseUrl } : {}),
      }
    : undefined,
});
