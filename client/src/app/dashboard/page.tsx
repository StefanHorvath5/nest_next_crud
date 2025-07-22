// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  if (!user) return null; 
  
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {user.email}</h1>
      <p>Your role is: {user.role}</p>
      <button onClick={logout} className="mt-4 bg-red-500 text-white px-4 py-2">
        Logout
      </button>
    </div>
  );
}
