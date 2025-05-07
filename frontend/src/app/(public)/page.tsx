"use client";

import { getPrivateClient } from "@/lib/services/getPrivate/client";
import { useEffect, useState } from "react";

const PublicPage = () => {
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPrivateClient();
        if (response.user) {
          setData(JSON.stringify(response, null, 2));
        } else {
          setError(response.message);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Public Example
        </h1>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : data ? (
          <pre className="bg-white text-gray-800 border border-gray-300 rounded p-4 text-left text-sm font-mono whitespace-pre-wrap overflow-auto">
            {data}
          </pre>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PublicPage;
