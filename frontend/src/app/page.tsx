"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearTokens, getAccessToken } from "@/lib/auth";

interface Me {
  id: string;
  email: string;
  name: string | null;
}

export default function Home() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    api("/api/auth/me")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => setMe(data.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Welcome{me?.name ? `, ${me.name}` : ""}</h1>
        <p className="text-sm text-gray-500">{me?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
