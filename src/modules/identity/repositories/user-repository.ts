import "server-only";

import type { PrismaClient } from "@/generated/server/prisma/client";

type UserDatabaseClient = Pick<PrismaClient, "user">;

export type CreateCustomerInput = {
  authUserId: string;
  normalizedEmail: string;
  emailVerifiedAt: Date | null;
};

const userSelection = {
  id: true,
  authUserId: true,
  normalizedEmail: true,
  role: true,
  status: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function createUserRepository(client: UserDatabaseClient) {
  return {
    findByAuthUserId(authUserId: string) {
      return client.user.findUnique({
        where: { authUserId },
        select: userSelection,
      });
    },

    findByNormalizedEmail(normalizedEmail: string) {
      return client.user.findUnique({
        where: { normalizedEmail },
        select: userSelection,
      });
    },

    createCustomer(input: CreateCustomerInput) {
      return client.user.create({
        data: {
          authUserId: input.authUserId,
          normalizedEmail: input.normalizedEmail,
          emailVerifiedAt: input.emailVerifiedAt,
          role: "CUSTOMER",
          status: "ACTIVE",
        },
        select: userSelection,
      });
    },
  };
}
