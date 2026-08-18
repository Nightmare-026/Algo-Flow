"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveAuthOrigin, safeInternalPath } from "@/lib/auth/redirects";
import {
  ACCOUNT_REGISTRATION_AVAILABLE,
  PRIVACY_VERSION,
  REGISTRATION_BLOCK_REASON,
  TERMS_VERSION,
} from "@/lib/legal/policy-versions";
import { createClient } from "@/lib/supabase/server";

function textField(formData: FormData, name: string, trim = true) {
  const value = formData.get(name);
  if (typeof value !== "string") return "";
  return trim ? value.trim() : value;
}

async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = resolveAuthOrigin(process.env, headerStore.get("origin"));
  if (!origin) {
    throw new Error("Authentication redirect origin is not configured.");
  }
  return origin;
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: textField(formData, "email").toLowerCase(),
    password: textField(formData, "password", false),
  };
  const nextUrl = safeInternalPath(formData.get("next"));

  if (!data.email || !data.password) {
    redirect(
      `/login?error=${encodeURIComponent("Email and password are required.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent("Email or password is incorrect.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function loginWithOAuth(provider: "google" | "github") {
  if (!ACCOUNT_REGISTRATION_AVAILABLE) {
    redirect(`/login?error=${encodeURIComponent("Social sign-in is temporarily unavailable.")}`);
  }

  const supabase = await createClient();

  let origin: string;
  try {
    origin = await getRequestOrigin();
  } catch {
    redirect(
      `/login?error=${encodeURIComponent("Authentication service is temporarily unavailable. Please try again.")}`
    );
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signup(formData: FormData) {
  const nextUrl = safeInternalPath(formData.get("next"));
  if (!ACCOUNT_REGISTRATION_AVAILABLE) {
    redirect(
      `/signup?error=${encodeURIComponent(REGISTRATION_BLOCK_REASON)}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  const firstName = textField(formData, "first_name");
  const lastName = textField(formData, "last_name");
  const gender = textField(formData, "gender");
  const email = textField(formData, "email").toLowerCase();
  const password = textField(formData, "password", false);
  const passwordConfirm = textField(formData, "password_confirm", false);
  const legalAccepted = textField(formData, "legal_accepted") === "yes";
  const termsVersion = textField(formData, "terms_version");
  const privacyVersion = textField(formData, "privacy_version");
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailLooksValid) {
    redirect(
      `/signup?error=${encodeURIComponent("Enter a valid email address.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }
  if (password.length < 8) {
    redirect(
      `/signup?error=${encodeURIComponent("Password must contain at least 8 characters.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }
  if (password !== passwordConfirm) {
    redirect(
      `/signup?error=${encodeURIComponent("Passwords do not match.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }
  if (!legalAccepted || termsVersion !== TERMS_VERSION || privacyVersion !== PRIVACY_VERSION) {
    redirect(
      `/signup?error=${encodeURIComponent("Accept the current Terms and acknowledge the current Privacy Policy.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  let origin: string;
  try {
    origin = await getRequestOrigin();
  } catch {
    redirect(
      `/signup?error=${encodeURIComponent("Authentication service is temporarily unavailable. Please try again.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  const supabase = await createClient();
  const acceptedAt = new Date().toISOString();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        age_18_or_older: true, // Included in the combined legal_accepted checkbox
        accepted_terms_version: TERMS_VERSION,
        accepted_privacy_version: PRIVACY_VERSION,
        legal_accepted_at: acceptedAt,
      },
    },
  });

  if (error) {
    redirect(
      `/signup?error=${encodeURIComponent("Unable to create an account. Check your details or try again later.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }
  if (!data.session) {
    redirect(
      `/signup?success=${encodeURIComponent("Please check your email to verify your account.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}
export async function sendPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = textField(formData, "email").toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/forgot-password?error=" + encodeURIComponent("Enter a valid email address."));
  }

  let origin: string;
  try {
    origin = await getRequestOrigin();
  } catch {
    redirect(
      "/forgot-password?error=" +
        encodeURIComponent("Authentication service is temporarily unavailable. Please try again.")
    );
  }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    "/forgot-password?success=" +
      encodeURIComponent("Password reset link sent. Check your email to continue.")
  );
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = textField(formData, "password", false);
  const passwordConfirm = textField(formData, "password_confirm", false);

  if (password.length < 8) {
    redirect(
      "/reset-password?error=" + encodeURIComponent("Password must contain at least 8 characters.")
    );
  }

  if (password !== passwordConfirm) {
    redirect("/reset-password?error=" + encodeURIComponent("Passwords do not match."));
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/login?success=" + encodeURIComponent("Password updated. You can log in now."));
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
