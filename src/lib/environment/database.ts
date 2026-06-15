import "server-only";

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

export type DatabaseEnvironment = {
  databaseUrl: string;
};

export type TestDatabaseEnvironment = {
  testDatabaseUrl: string;
};

function invalidEnvironment(variableName: string): never {
  throw new Error(`Invalid database environment: ${variableName}`);
}

function readPostgreSqlUrl(
  environment: EnvironmentSource,
  variableName: string,
) {
  const value = environment[variableName]?.trim();

  if (!value) {
    return invalidEnvironment(variableName);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return invalidEnvironment(variableName);
  }

  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.hostname ||
    !url.username ||
    url.pathname === "" ||
    url.pathname === "/"
  ) {
    return invalidEnvironment(variableName);
  }

  return { url, value };
}

function isApprovedRuntimePooler(url: URL) {
  const isLocalPooler =
    ["127.0.0.1", "localhost"].includes(url.hostname) &&
    url.port === "55329" &&
    url.username.startsWith("postgres.pooler-");
  const isSupabaseCloudPooler =
    url.hostname.endsWith(".pooler.supabase.com") &&
    url.username.startsWith("postgres.");

  return isLocalPooler || isSupabaseCloudPooler;
}

export function readDatabaseEnvironment(
  environment: EnvironmentSource,
): DatabaseEnvironment {
  const { url, value } = readPostgreSqlUrl(environment, "DATABASE_URL");

  if (!isApprovedRuntimePooler(url)) {
    return invalidEnvironment("DATABASE_URL");
  }

  return { databaseUrl: value };
}

export function readTestDatabaseEnvironment(
  environment: EnvironmentSource,
): TestDatabaseEnvironment {
  const { value } = readPostgreSqlUrl(environment, "TEST_DATABASE_URL");

  return { testDatabaseUrl: value };
}
