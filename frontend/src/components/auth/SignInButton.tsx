"use client";

import { useRouter } from "next/navigation";

export const SignInButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 rounded transition text-white bg-blue-600 hover:bg-blue-700"
    >
      Sign In
    </button>
  );
};
