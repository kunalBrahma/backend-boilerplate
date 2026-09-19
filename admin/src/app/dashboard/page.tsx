"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { clearTokens, getAccessToken } from "@/lib/auth";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      router.push("/login");
      return;
    }

    api("/api/users")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(setUsers)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700"
          >
            Log out
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.name || "—"}</td>
                    <td className="px-4 py-2">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
