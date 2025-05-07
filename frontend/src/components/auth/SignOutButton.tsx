"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out failed:", error.message);

      router.push("/"); // redirect después del logout
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 rounded transition text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gray-600 hover:bg-gray-700"
      }`}
    >
      {loading ? "Loading..." : "Sign Out"}
    </button>
  );
};
