/**
 * Environment aliases.
 *
 * Lovable-managed secrets can never be read back, so a self-hosted copy
 * (Vercel) cannot reuse the exact same values. To keep both deployments in
 * sync, the app also accepts user-owned alias names whose values the user
 * chooses themselves and can therefore paste anywhere.
 *
 * Alias (user-owned)          ->  canonical name used by the app
 * GATE_SESSION_SECRET         ->  SESSION_SECRET
 * GATE_HASH_SALT              ->  ADMIN_HASH_SALT
 * DB_SERVICE_KEY         ->  SUPABASE_SERVICE_ROLE_KEY
 *
 * The canonical value wins when present. Lovable injects canonical values for
 * its connected database, while self-hosted deployments can use the aliases.
 * This prevents a user-owned alias from accidentally pairing a key from one
 * project with the managed URL of another project.
 */
const ALIASES: Record<string, string> = {
  SESSION_SECRET: "GATE_SESSION_SECRET",
  ADMIN_HASH_SALT: "GATE_HASH_SALT",
  SUPABASE_SERVICE_ROLE_KEY: "DB_SERVICE_KEY",
};

export function envValue(canonical: string): string {
  const alias = ALIASES[canonical];
  const canonicalValue = process.env[canonical];
  const aliasValue = alias ? process.env[alias] : undefined;
  return (canonicalValue && canonicalValue.trim()) || (aliasValue && aliasValue.trim()) || "";
}

export function applyEnvAliases(): void {
  for (const canonical of Object.keys(ALIASES)) {
    const value = envValue(canonical);
    if (value && !process.env[canonical]) {
      process.env[canonical] = value;
    }
  }
}

applyEnvAliases();
