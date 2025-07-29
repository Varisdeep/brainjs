"use client";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminUserPage() {
  // State management for admin user management
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => setError("Access denied or failed to load users."));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole }),
    });
    if (res.ok) {
      setNotification(`Role updated to "${newRole}" for ${userEmail}`);
      fetchUsers();
    } else {
      setNotification("Failed to update role.");
    }
    setTimeout(() => setNotification(""), 3000);
  };

  return (
    <main className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>
      {error && <p className="text-red-600">{error}</p>}
      {notification && <p className="text-green-600 mb-4">{notification}</p>}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 px-3">Email</th>
            <th className="text-left py-2 px-3">Name</th>
            <th className="text-left py-2 px-3">Role</th>
            <th className="text-left py-2 px-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-3">{user.email}</td>
              <td className="py-2 px-3">{user.name}</td>
              <td className="py-2 px-3 capitalize">{user.role}</td>
              <td className="py-2 px-3">
                {user.role !== "admin" && (
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    onClick={() => handleRoleChange(user._id, "admin", user.email)}
                  >
                    Promote to Admin
                  </button>
                )}
                {user.role !== "user" && (
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded"
                    onClick={() => handleRoleChange(user._id, "user", user.email)}
                  >
                    Demote to User
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
} 