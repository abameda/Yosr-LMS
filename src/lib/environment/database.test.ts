// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  readDatabaseEnvironment,
  readTestDatabaseEnvironment,
} from "@/lib/environment/database";

const localPoolerUrl =
  "postgresql://postgres.pooler-dev:postgres@127.0.0.1:55329/postgres?sslmode=disable";

describe("database environment", () => {
  it.each([undefined, "", "   "])(
    "rejects a missing or empty DATABASE_URL",
    (databaseUrl) => {
      expect(() =>
        readDatabaseEnvironment({ DATABASE_URL: databaseUrl }),
      ).toThrow("DATABASE_URL");
    },
  );

  it.each([
    "not-a-url",
    "https://example.com/database",
    "postgresql://postgres:postgres@127.0.0.1:55322/postgres",
    "postgresql://postgres:postgres@db.example.supabase.co/postgres",
  ])("rejects an invalid runtime database URL", (databaseUrl) => {
    expect(() =>
      readDatabaseEnvironment({ DATABASE_URL: databaseUrl }),
    ).toThrow("DATABASE_URL");
  });

  it("accepts the documented local transaction pooler URL", () => {
    expect(readDatabaseEnvironment({ DATABASE_URL: localPoolerUrl })).toEqual({
      databaseUrl: localPoolerUrl,
    });
  });

  it("accepts a Supabase cloud pooler URL", () => {
    const databaseUrl =
      "postgresql://postgres.projectref:secret@aws-0-eu-central-1.pooler.supabase.com:6543/postgres";

    expect(readDatabaseEnvironment({ DATABASE_URL: databaseUrl })).toEqual({
      databaseUrl,
    });
  });

  it("does not include the rejected value in an error", () => {
    const secretValue = "https://user:secret@example.com/database";

    expect(() =>
      readDatabaseEnvironment({ DATABASE_URL: secretValue }),
    ).toThrowError(
      expect.objectContaining({
        message: expect.not.stringContaining(secretValue),
      }),
    );
  });

  it("requires an explicit TEST_DATABASE_URL", () => {
    expect(() =>
      readTestDatabaseEnvironment({ DATABASE_URL: localPoolerUrl }),
    ).toThrow("TEST_DATABASE_URL");
  });

  it("accepts an explicit PostgreSQL TEST_DATABASE_URL", () => {
    const testDatabaseUrl =
      "postgresql://postgres:postgres@127.0.0.1:55322/postgres";

    expect(
      readTestDatabaseEnvironment({
        DATABASE_URL: localPoolerUrl,
        TEST_DATABASE_URL: testDatabaseUrl,
      }),
    ).toEqual({ testDatabaseUrl });
  });
});
