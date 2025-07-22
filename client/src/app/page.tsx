// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Item {
  id: number;
  name: string;
  ownerId: number;
}

export default function HomePage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/items")
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Failed to load items:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>

      <nav className="space-x-4 mb-6">
        {!user ? (
          <>
            <Link href="/login" className="text-blue-500">
              Login
            </Link>
            <Link href="/register" className="text-blue-500">Register</Link>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="text-blue-500">
              Dashboard
            </Link>
            <Link href="/items" className="text-blue-500">
              Items
            </Link>
          </>
        )}
      </nav>

      <h2 className="text-xl font-semibold mb-2">Public Items</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="border p-2">
            <strong>{item.name}</strong> (Owner ID: {item.ownerId})
          </li>
        ))}
      </ul>
    </div>
  );
}
