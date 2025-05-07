"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const CallbackPage = () => {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        router.replace("/profile");
      } else {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router, supabase]);

  return <p className="p-8 text-center">Logging you in...</p>;
};

export default CallbackPage;
