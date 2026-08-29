"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <main>
        <h1>Welcome, {user?.name}</h1>

        <button onClick={logout}>Logout</button>
      </main>
    </AuthGuard>
  );
}
