"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const LoginPage = () => {
  const supabase = createSupabaseBrowserClient();

  const handleLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl text-gray-700 hover:text-black font-bold mb-6 text-center">
          Sign in
        </h1>

        <button
          onClick={() => handleLogin("google")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mb-4 transition"
        >
          Sign in with Google
        </button>

        <button
          onClick={() => handleLogin("github")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
