// @vitest-environment node

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, describe, expect, it, vi } from "vitest";

import { PrismaClient } from "@/generated/server/prisma/client";
import { readTestDatabaseEnvironment } from "@/lib/environment/database";
import { createLearnerProfileRepository } from "@/modules/identity/repositories/learner-profile-repository";
import { createUserRepository } from "@/modules/identity/repositories/user-repository";

const { testDatabaseUrl } = readTestDatabaseEnvironment(process.env);
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: testDatabaseUrl }),
});
const users = createUserRepository(prisma);
const learnerProfiles = createLearnerProfileRepository(prisma);
const createdUserIds: string[] = [];
let runtimeDatabase:
  | (typeof import("@/lib/database/client"))["database"]
  | undefined;

afterAll(async () => {
  if (createdUserIds.length > 0) {
    await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  }

  await prisma.$disconnect();
  await runtimeDatabase?.$disconnect();
});

describe("identity repositories", () => {
  it("reuses the development Prisma Client across module reloads", async () => {
    const firstModule = await import("@/lib/database/client");
    runtimeDatabase = firstModule.database;

    vi.resetModules();
    const secondModule = await import("@/lib/database/client");

    expect(secondModule.database).toBe(firstModule.database);
  });

  it("persists and finds a Customer by trusted identity fields", async () => {
    const authUserId = randomUUID();
    const normalizedEmail = `task-1-3-${randomUUID()}@example.test`;

    const created = await users.createCustomer({
      authUserId,
      normalizedEmail,
      emailVerifiedAt: null,
    });
    createdUserIds.push(created.id);

    await expect(users.findByAuthUserId(authUserId)).resolves.toMatchObject({
      id: created.id,
      authUserId,
      normalizedEmail,
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    await expect(
      users.findByNormalizedEmail(normalizedEmail),
    ).resolves.toMatchObject({
      id: created.id,
    });
  });

  it("creates, finds, and updates the learner profile owned by a User", async () => {
    const user = await users.createCustomer({
      authUserId: randomUUID(),
      normalizedEmail: `task-1-3-${randomUUID()}@example.test`,
      emailVerifiedAt: new Date(),
    });
    createdUserIds.push(user.id);

    const created = await learnerProfiles.create({
      userId: user.id,
      displayName: "متعلم تجريبي",
      educationalLevelLabel: null,
    });

    await expect(learnerProfiles.findByUserId(user.id)).resolves.toMatchObject({
      id: created.id,
      userId: user.id,
      displayName: "متعلم تجريبي",
    });

    await expect(
      learnerProfiles.updateByUserId(user.id, {
        displayName: "متعلم محدث",
        educationalLevelLabel: "المرحلة الإعدادية",
      }),
    ).resolves.toMatchObject({
      id: created.id,
      displayName: "متعلم محدث",
      educationalLevelLabel: "المرحلة الإعدادية",
    });
  });
});
