"use client";

import { useSessionContext } from "@/context/SessionContext";
import Link from "next/link";
import { SignInButton } from "./auth/SignInButton";
import { SignOutButton } from "./auth/SignOutButton";

export const Navbar = () => {
  const { user, loading } = useSessionContext();

  return (
    <nav className="w-full p-4 bg-white shadow flex justify-between items-center">
      <Link
        href="/"
        className="text-gray-700 hover:text-black text-xl font-bold"
      >
        SaaS Starter Kit
      </Link>

      <div className="flex items-center gap-4">
        {loading ? null : user ? (
          <>
            <Link href="/profile" className="text-gray-700 hover:text-black">
              Profile
            </Link>
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};
