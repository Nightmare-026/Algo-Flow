"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeInternalPath(value: FormDataEntryValue | string | null, fallback = "/dashboard") {
  if (typeof value !== "string" || value.length === 0) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;

  try {
    const parsed = new URL(value, "http://algo-flow.local");
    if (parsed.origin !== "http://algo-flow.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

async function getRequestOrigin() {
  const headerStore = await headers();
  return (
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const nextUrl = safeInternalPath(formData.get("next"));

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

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirm = formData.get("password_confirm") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const gender = formData.get("gender") as string;

  if (password !== password_confirm) {
    redirect("/signup?error=" + encodeURIComponent("Passwords do not match."));
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }

  if (!data.session) {
    redirect("/signup?success=" + encodeURIComponent("Please check your email to verify your account."));
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function sendPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
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
  const password = formData.get("password") as string;
  const passwordConfirm = formData.get("password_confirm") as string;

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