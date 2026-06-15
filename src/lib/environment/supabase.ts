type EnvironmentSource = Readonly<Record<string, string | undefined>>;

export type PublicSupabaseEnvironment = {
  publishableKey: string;
  supabaseUrl: string;
};

export type PrivilegedSupabaseEnvironment = {
  secretKey: string;
  supabaseUrl: string;
};

function invalidEnvironment(variableName: string): never {
  throw new Error(`Invalid Supabase environment: ${variableName}`);
}

function readSupabaseUrl(environment: EnvironmentSource) {
  const value = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();

  if (!value) {
    return invalidEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return invalidEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!["http:", "https:"].includes(url.protocol) || !url.hostname) {
    return invalidEnvironment("NEXT_PUBLIC_SUPABASE_URL");
  }

  return value;
}

export function readPublicSupabaseEnvironment(
  environment: EnvironmentSource,
): PublicSupabaseEnvironment {
  const supabaseUrl = readSupabaseUrl(environment);
  const publishableKey =
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!publishableKey || !publishableKey.startsWith("sb_publishable_")) {
    return invalidEnvironment("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return { publishableKey, supabaseUrl };
}

export function readPrivilegedSupabaseEnvironment(
  environment: EnvironmentSource,
): PrivilegedSupabaseEnvironment {
  const supabaseUrl = readSupabaseUrl(environment);
  const secretKey = environment.SUPABASE_SECRET_KEY?.trim();

  if (!secretKey || !secretKey.startsWith("sb_secret_")) {
    return invalidEnvironment("SUPABASE_SECRET_KEY");
  }

  return { secretKey, supabaseUrl };
}
