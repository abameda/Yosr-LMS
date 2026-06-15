// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { provisionCustomer } from "@/modules/identity/services/provision-customer";

function createTransactionClient() {
  return {
    user: {
      upsert: vi.fn(),
    },
    learnerProfile: {
      upsert: vi.fn(),
    },
  };
}

describe("provisionCustomer", () => {
  it("creates a Customer and one default Learner profile from trusted Auth identity", async () => {
    const transaction = createTransactionClient();
    transaction.user.upsert.mockResolvedValue({
      id: "local-user-id",
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    transaction.learnerProfile.upsert.mockResolvedValue({
      id: "learner-profile-id",
      userId: "local-user-id",
    });
    const database = {
      $transaction: vi.fn((operation) => operation(transaction)),
    };

    const result = await provisionCustomer(
      {
        authUserId: "auth-user-id",
        email: "  Learner@Example.COM ",
        emailVerifiedAt: null,
      },
      database,
    );

    expect(transaction.user.upsert).toHaveBeenCalledWith({
      where: { authUserId: "auth-user-id" },
      create: {
        authUserId: "auth-user-id",
        normalizedEmail: "learner@example.com",
        emailVerifiedAt: null,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
      update: {
        normalizedEmail: "learner@example.com",
      },
      select: {
        id: true,
        role: true,
        status: true,
      },
    });
    expect(transaction.learnerProfile.upsert).toHaveBeenCalledWith({
      where: { userId: "local-user-id" },
      create: {
        userId: "local-user-id",
        displayName: "المتعلم",
        educationalLevelLabel: null,
      },
      update: {},
      select: {
        id: true,
        userId: true,
      },
    });
    expect(result).toEqual({
      learnerProfileId: "learner-profile-id",
      userId: "local-user-id",
    });
  });

  it("repairs a missing Learner profile without overwriting existing role or status", async () => {
    const transaction = createTransactionClient();
    transaction.user.upsert.mockResolvedValue({
      id: "existing-user-id",
      role: "ADMIN",
      status: "DISABLED",
    });
    transaction.learnerProfile.upsert.mockResolvedValue({
      id: "repaired-profile-id",
      userId: "existing-user-id",
    });
    const database = {
      $transaction: vi.fn((operation) => operation(transaction)),
    };

    await provisionCustomer(
      {
        authUserId: "auth-user-id",
        email: "customer@example.com",
        emailVerifiedAt: new Date("2026-06-15T12:00:00.000Z"),
      },
      database,
    );

    const upsert = transaction.user.upsert.mock.calls[0]?.[0];
    expect(upsert.update).not.toHaveProperty("role");
    expect(upsert.update).not.toHaveProperty("status");
    expect(transaction.learnerProfile.upsert).toHaveBeenCalledOnce();
  });

  it("does not erase an existing verification timestamp from a stale Auth payload", async () => {
    const transaction = createTransactionClient();
    transaction.user.upsert.mockResolvedValue({
      id: "existing-user-id",
      role: "CUSTOMER",
      status: "ACTIVE",
    });
    transaction.learnerProfile.upsert.mockResolvedValue({
      id: "learner-profile-id",
      userId: "existing-user-id",
    });
    const database = {
      $transaction: vi.fn((operation) => operation(transaction)),
    };

    await provisionCustomer(
      {
        authUserId: "auth-user-id",
        email: "customer@example.com",
        emailVerifiedAt: null,
      },
      database,
    );

    expect(transaction.user.upsert.mock.calls[0]?.[0].update).toEqual({
      normalizedEmail: "customer@example.com",
    });
  });

  it("rejects an Auth identity without a usable email before opening a transaction", async () => {
    const database = {
      $transaction: vi.fn(),
    };

    await expect(
      provisionCustomer(
        {
          authUserId: "auth-user-id",
          email: " ",
          emailVerifiedAt: null,
        },
        database,
      ),
    ).rejects.toThrow("Customer provisioning requires a valid Auth identity.");
    expect(database.$transaction).not.toHaveBeenCalled();
  });
});
