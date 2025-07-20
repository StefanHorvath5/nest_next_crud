"use client";
import { useEffect, useState } from "react";
import axios from "axios";

type User = { id: number; name: string; email: string };

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/users").then((res) => setUsers(res.data));
  }, []);

  const createUser = async () => {
    const res = await axios.post("http://localhost:3001/users", {
      name,
      email,
    });
    setUsers([...users, res.data]);
    setName("");
    setEmail("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="mb-4">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={createUser}
          className="bg-blue-500 text-white px-4 py-2"
        >
          Add
        </button>
      </div>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
