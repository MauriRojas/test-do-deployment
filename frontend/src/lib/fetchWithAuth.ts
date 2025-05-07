import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { AuthError, ApiError } from "./errors";

export async function fetchWithAuth<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const supabase = createSupabaseBrowserClient(); // ToDo: maybe this should be a function parameter.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new AuthError("User is not authenticated");
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    throw new AuthError("Unauthorized");
  }

  if (!response.ok) {
    let message = "API request failed";
    const body = await response.json();
    message = body?.message || message;

    throw new ApiError(message, response.status);
  }

  return response.json();
}
