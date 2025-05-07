import { createSupabaseServerClient } from "@/utils/supabase/server";
import { getPrivate } from "@/lib/services/getPrivate/server";
import Image from "next/image";

const ProfilePage = async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unexpected unauthenticated access");
  const protectedData = await getPrivate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        {user.user_metadata?.avatar_url && (
          <div className="flex justify-center mb-4">
            <Image
              src={user.user_metadata.avatar_url}
              alt="User avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold mb-2">
          {user.user_metadata?.full_name || user.email}
        </h1>
        <p className="text-gray-600 mb-4">{user.email}</p>

        {protectedData?.user ? (
          <pre className="bg-white text-gray-800 border border-gray-300 rounded p-4 text-left text-sm font-mono whitespace-pre-wrap overflow-auto">
            {JSON.stringify(protectedData, null, 2)}
          </pre>
        ) : (
          <p className="text-red-500">{protectedData.message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
