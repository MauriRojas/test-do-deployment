import { createSupabaseServerClient } from "@/utils/supabase/server";
import { AuthError, ApiError } from "./errors";

export async function fetchServerWithAuth<T>(url: string): Promise<T> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (!token) throw new AuthError("Not authenticated");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401) throw new AuthError("Unauthorized");

  if (!response.ok) {
    let message = "API error";
    try {
      const body = await response.json();
      message = body?.message || message;
    } catch {}
    throw new ApiError(message, response.status);
  }

  return response.json();
}
