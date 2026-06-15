import "server-only";

import type { PrismaClient } from "@/generated/server/prisma/client";

type LearnerProfileDatabaseClient = Pick<PrismaClient, "learnerProfile">;

export type CreateLearnerProfileInput = {
  userId: string;
  displayName: string;
  educationalLevelLabel: string | null;
};

export type UpdateLearnerProfileInput = {
  displayName: string;
  educationalLevelLabel: string | null;
};

const learnerProfileSelection = {
  id: true,
  userId: true,
  displayName: true,
  educationalLevelLabel: true,
  createdAt: true,
  updatedAt: true,
} as const;

export function createLearnerProfileRepository(
  client: LearnerProfileDatabaseClient,
) {
  return {
    findByUserId(userId: string) {
      return client.learnerProfile.findUnique({
        where: { userId },
        select: learnerProfileSelection,
      });
    },

    create(input: CreateLearnerProfileInput) {
      return client.learnerProfile.create({
        data: input,
        select: learnerProfileSelection,
      });
    },

    updateByUserId(userId: string, input: UpdateLearnerProfileInput) {
      return client.learnerProfile.update({
        where: { userId },
        data: input,
        select: learnerProfileSelection,
      });
    },
  };
}
