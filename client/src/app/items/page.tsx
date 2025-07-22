// app/items/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

interface Item {
  id: number;
  name: string;
  ownerId: number;
}

export default function ItemsPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:3001/items", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Load error:", err));
  }, [user]);

  const handleAdd = async () => {
    const res = await fetch("http://localhost:3001/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newItem }),
    });

    if (res.ok) {
      const item = await res.json();
      setItems((prev) => [...prev, item]);
      setNewItem("");
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3001/items/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const canEdit = (item: Item) =>
    user?.role === "admin" || item.ownerId === user?.id;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Manage Items</h1>

      <div className="flex space-x-2 mb-4">
        <input
          className="border p-2"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New item name"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-2 flex justify-between items-center"
          >
            <span>{item.name}</span>
            {canEdit(item) && (
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-2 py-1 text-sm"
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
