"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
}

interface UserRoleManagerProps {
  currentUserId: string;
}

export default function UserRoleManager({ currentUserId }: UserRoleManagerProps) {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUsers(data.users))
      .catch(() => toast.error("Access denied or failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
    
    // Polling for real-time updates every 30 seconds
    const interval = setInterval(fetchUsers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    setUpdatingId(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newRole }),
    });
    if (res.ok) {
      toast.success(`Role updated to "${newRole}" for ${userEmail}`);
      toast.info("Email notification sent to user");
      fetchUsers();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to update role.");
    }
    setUpdatingId(null);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">User Role Management</h2>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isCurrentUser = user._id === currentUserId;
                return (
                  <tr key={user._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? 'bg-blue-50' : ''
                  }`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                                                 <div className="w-10 h-10 gradient-blue rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.[0] || user.email?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          {isCurrentUser && (
                            <p className="text-xs text-blue-600 font-medium">(You)</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{user.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {!isCurrentUser && user.role !== "admin" && (
                        <button
                          className={`btn-primary text-sm px-4 py-2 mr-2 ${
                            updatingId === user._id ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleRoleChange(user._id, "admin", user.email)}
                          disabled={updatingId === user._id}
                        >
                          {updatingId === user._id ? (
                            <div className="flex items-center">
                              <div className="spinner mr-2"></div>
                              Updating...
                            </div>
                          ) : (
                            "Promote to Admin"
                          )}
                        </button>
                      )}
                      {!isCurrentUser && user.role !== "user" && (
                        <button
                          className={`btn-secondary text-sm px-4 py-2 ${
                            updatingId === user._id ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          onClick={() => handleRoleChange(user._id, "user", user.email)}
                          disabled={updatingId === user._id}
                        >
                          {updatingId === user._id ? (
                            <div className="flex items-center">
                              <div className="spinner mr-2"></div>
                              Updating...
                            </div>
                          ) : (
                            "Demote to User"
                          )}
                        </button>
                      )}
                      {isCurrentUser && (
                        <span className="text-gray-500 text-sm italic">Cannot modify own role</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 