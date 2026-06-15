import "server-only";

import type { Prisma } from "@/generated/server/prisma/client";

const defaultLearnerDisplayName = "المتعلم";

export type CustomerAuthIdentity = {
  authUserId: string;
  email: string;
  emailVerifiedAt: Date | null;
};

type ProvisioningTransaction = Pick<
  Prisma.TransactionClient,
  "learnerProfile" | "user"
>;

export type ProvisioningDatabase = {
  $transaction<T>(
    operation: (transaction: ProvisioningTransaction) => Promise<T>,
  ): Promise<T>;
};

function normalizeEmail(email: string) {
  return email.trim().toLocaleLowerCase("en-US");
}

function validateAuthIdentity(identity: CustomerAuthIdentity) {
  const authUserId = identity.authUserId.trim();
  const normalizedEmail = normalizeEmail(identity.email);

  if (!authUserId || !normalizedEmail || !normalizedEmail.includes("@")) {
    throw new Error("Customer provisioning requires a valid Auth identity.");
  }

  return { authUserId, normalizedEmail };
}

export async function provisionCustomer(
  identity: CustomerAuthIdentity,
  database: ProvisioningDatabase,
) {
  const { authUserId, normalizedEmail } = validateAuthIdentity(identity);

  return database.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
      where: { authUserId },
      create: {
        authUserId,
        normalizedEmail,
        emailVerifiedAt: identity.emailVerifiedAt,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      update: {
        normalizedEmail,
        ...(identity.emailVerifiedAt
          ? { emailVerifiedAt: identity.emailVerifiedAt }
          : {}),
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });
    const learnerProfile = await transaction.learnerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        displayName: defaultLearnerDisplayName,
        educationalLevelLabel: null,
      },
      update: {},
      select: {
        id: true,
        userId: true,
      },
    });

    return {
      learnerProfileId: learnerProfile.id,
      userId: user.id,
    };
  });
}
