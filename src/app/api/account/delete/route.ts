import { NextResponse } from "next/server";
import { deleteUserAccountAction } from "@/features/account/api";

export async function POST() {
  const result = await deleteUserAccountAction();
  if (!result.ok) {
    const status = result.requiresAuth ? 401 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json(result);
}
