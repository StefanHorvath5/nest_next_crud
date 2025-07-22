// app/unauthorized/page.tsx
"use client";

export default function UnauthorizedPage() {
  return (
    <div className="p-6 text-red-500">
      <h1 className="text-xl font-bold">🚫 Unauthorized</h1>
      <p>You do not have access to this page.</p>
    </div>
  );
}
