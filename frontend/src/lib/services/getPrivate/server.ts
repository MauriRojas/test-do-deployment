import { fetchServerWithAuth } from "@/lib/fetchServerWithAuth";
import { ApiError, AuthError } from "../../errors";

export type ProtectedApiResponse = {
  message: string;
  user: {
    sub: string;
    email: string;
    [key: string]: unknown;
  } | null;
};

export function handleApiError(err: unknown): ProtectedApiResponse {
  if (err instanceof AuthError) {
    return { message: "Unauthorized", user: null };
  }

  if (err instanceof ApiError) {
    return { message: `API error: ${err.message}`, user: null };
  }

  throw err;
}

export const getPrivate = async (): Promise<ProtectedApiResponse> => {
  return await fetchServerWithAuth<ProtectedApiResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/private`
  ).catch(handleApiError);
};
