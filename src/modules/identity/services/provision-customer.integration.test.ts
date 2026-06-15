// @vitest-environment node

import { randomUUID } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { afterAll, describe, expect, it } from "vitest";

import { PrismaClient } from "@/generated/server/prisma/client";
import { readTestDatabaseEnvironment } from "@/lib/environment/database";
import { provisionCustomer } from "@/modules/identity/services/provision-customer";

const { testDatabaseUrl } = readTestDatabaseEnvironment(process.env);
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: testDatabaseUrl }),
});
const createdAuthUserIds: string[] = [];

afterAll(async () => {
  if (createdAuthUserIds.length > 0) {
    await prisma.user.deleteMany({
      where: { authUserId: { in: createdAuthUserIds } },
    });
  }

  await prisma.$disconnect();
});

describe("provisionCustomer transaction", () => {
  it("creates exactly one User and LearnerProfile across repeated calls", async () => {
    const authUserId = randomUUID();
    const email = `task-1-5-${randomUUID()}@example.test`;
    createdAuthUserIds.push(authUserId);

    const first = await provisionCustomer(
      { authUserId, email, emailVerifiedAt: null },
      prisma,
    );
    const second = await provisionCustomer(
      { authUserId, email: email.toUpperCase(), emailVerifiedAt: null },
      prisma,
    );

    expect(second).toEqual(first);
    await expect(prisma.user.count({ where: { authUserId } })).resolves.toBe(1);
    await expect(
      prisma.learnerProfile.count({ where: { userId: first.userId } }),
    ).resolves.toBe(1);
  });

  it("repairs a missing LearnerProfile without duplicating the User", async () => {
    const authUserId = randomUUID();
    const email = `task-1-5-${randomUUID()}@example.test`;
    createdAuthUserIds.push(authUserId);

    const initial = await provisionCustomer(
      { authUserId, email, emailVerifiedAt: null },
      prisma,
    );
    await prisma.learnerProfile.delete({
      where: { userId: initial.userId },
    });

    const repaired = await provisionCustomer(
      { authUserId, email, emailVerifiedAt: null },
      prisma,
    );

    expect(repaired.userId).toBe(initial.userId);
    expect(repaired.learnerProfileId).not.toBe(initial.learnerProfileId);
    await expect(prisma.user.count({ where: { authUserId } })).resolves.toBe(1);
    await expect(
      prisma.learnerProfile.count({ where: { userId: initial.userId } }),
    ).resolves.toBe(1);
  });
});
