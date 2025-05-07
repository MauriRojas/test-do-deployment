import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { AuthError } from "./errors";

export const getAuthenticatedUser = async (req: NextRequest) => {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) throw new AuthError("Missing token");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (key) => req.cookies.get(key)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  );

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new AuthError("Invalid or expired token");
  }

  return data.user;
};
