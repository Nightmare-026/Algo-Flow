"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { resolveAuthOrigin, safeInternalPath } from "@/lib/auth/redirects";
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
    let message = error.message;
    if (message.includes("Invalid login credentials")) {
      message = "Email or password is incorrect.";
    } else if (message.includes("Email not confirmed")) {
      message = "Please verify your email before logging in.";
    }
    redirect(`/login?error=${encodeURIComponent(message)}&next=${encodeURIComponent(nextUrl)}`);
  }

  revalidatePath("/", "layout");
  redirect(nextUrl);
}

export async function loginWithOAuth(provider: "google" | "github") {
  const supabase = await createClient();
  const origin = await getRequestOrigin();

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
  const supabase = await createClient();

  const email = textField(formData, "email").toLowerCase();
  const password = textField(formData, "password", false);
  const password_confirm = textField(formData, "password_confirm", false);
  const first_name = textField(formData, "first_name");
  const last_name = textField(formData, "last_name");
  const gender = textField(formData, "gender");
  const nextUrl = safeInternalPath(formData.get("next"));
  const allowedGenders = new Set(["Male", "Female", "Other", "Prefer not to say"]);
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!first_name || !last_name || first_name.length > 80 || last_name.length > 80) {
    redirect(
      `/signup?error=${encodeURIComponent("Enter a valid first and last name (up to 80 characters each).")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  if (!allowedGenders.has(gender)) {
    redirect(
      `/signup?error=${encodeURIComponent("Select a valid gender option.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  if (!emailLooksValid) {
    redirect(
      `/signup?error=${encodeURIComponent("Enter a valid email address.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  if (password.length < 6) {
    redirect(
      `/signup?error=${encodeURIComponent("Password must contain at least 6 characters.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  if (password !== password_confirm) {
    redirect(
      `/signup?error=${encodeURIComponent("Passwords do not match.")}&next=${encodeURIComponent(nextUrl)}`
    );
  }

  const origin = await getRequestOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name,
        last_name,
        full_name: `${first_name} ${last_name}`,
        gender,
      },
    },
  });

  if (error) {
    let message = error.message;
    if (message.includes("already registered")) {
      message = "An account with this email already exists. Please log in instead.";
    }
    redirect(`/signup?error=${encodeURIComponent(message)}&next=${encodeURIComponent(nextUrl)}`);
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

  const origin = await getRequestOrigin();
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

  if (password.length < 6) {
    redirect(
      "/reset-password?error=" + encodeURIComponent("Password must contain at least 6 characters.")
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
