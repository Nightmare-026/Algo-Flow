import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("database and authentication contract", () => {
  const migration = readFileSync(
    resolve("supabase/migrations/20260714113326_reconcile_database_contract.sql"),
    "utf8"
  );
  const databaseTypes = readFileSync(resolve("src/types/database.ts"), "utf8");
  const signupAction = readFileSync(resolve("src/app/(auth)/login/actions.ts"), "utf8");

  const profileFields = [
    "username",
    "avatar_url",
    "email",
    "first_name",
    "last_name",
    "full_name",
    "gender",
  ];

  test.each(profileFields)("keeps the %s profile field in SQL and TypeScript", (field) => {
    expect(migration).toContain(`add column if not exists ${field} text`);
    expect(databaseTypes).toMatch(new RegExp(`\\b${field}[?:]+ string \\| null`));
  });

  test("provisions the complete profile from trusted auth metadata", () => {
    expect(migration).toContain(
      "id, username, avatar_url, email, first_name, last_name, full_name, gender"
    );
    expect(migration).toContain("new.raw_user_meta_data->>'first_name'");
    expect(migration).toContain("new.raw_user_meta_data->>'last_name'");
    expect(migration).toContain("new.raw_user_meta_data->>'gender'");
    expect(migration).toContain("insert into public.preferences (id) values (new.id)");
    expect(migration).toContain("drop trigger if exists on_auth_user_created on auth.users");
    expect(migration).toContain("for each row execute function public.handle_new_user()");
  });

  test("keeps profile access owner-scoped and enforces the minimized signup contract", () => {
    expect(migration).toContain("authenticated_users_read_own_profile");
    expect(migration).toContain("authenticated_users_update_own_profile");
    expect(migration).toContain("with check ((select auth.uid()) = id)");
    expect(signupAction).toContain('textField(formData, "first_name")');
    expect(signupAction).toContain('textField(formData, "last_name")');
    expect(signupAction).toContain('textField(formData, "gender")');
    expect(signupAction).toContain("password.length < 8");
    expect(signupAction).not.toContain('textField(formData, "age_confirmed") === "yes"');
    expect(signupAction).toContain("termsVersion !== TERMS_VERSION");
    expect(signupAction).toContain("privacyVersion !== PRIVACY_VERSION");
    expect(signupAction).toContain("accepted_terms_version: TERMS_VERSION");
    expect(signupAction).toContain("accepted_privacy_version: PRIVACY_VERSION");
  });
});
