import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/server/prisma/client";
import { readDatabaseEnvironment } from "@/lib/environment/database";

const globalForDatabase = globalThis as typeof globalThis & {
  yosrDatabase?: PrismaClient;
};

function createDatabaseClient() {
  const { databaseUrl } = readDatabaseEnvironment(process.env);
  const adapter = new PrismaPg({ connectionString: databaseUrl });

  return new PrismaClient({ adapter });
}

export const database =
  globalForDatabase.yosrDatabase ?? createDatabaseClient();

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.yosrDatabase = database;
}
