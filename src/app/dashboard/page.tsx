"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import UserRoleManager from "@/components/UserRoleManager";
import StockPredictor from "@/components/StockPredictor";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (session) {
      fetchUserRole();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="container p-8">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container p-8">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {session.user?.name || session.user?.email}!
        </p>
      </div>

      <div className="grid grid-2 gap-8">
        {/* User Profile Card */}
        <div className="card">
          <div className="user-profile">
            <div className="user-avatar">
              {session.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>
                  {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                </span>
              )}
            </div>
            <div className="user-info">
              <h3>{session.user?.name || "User"}</h3>
              <p>{session.user?.email}</p>
              <span className="user-role">
                {userRole === "admin" ? "Administrator" : "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="card">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 gradient-green rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Stock Predictor</h3>
              <p className="text-gray-600">
                AI-powered stock price predictions and trend analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Predictor */}
      <div className="mt-8">
        <StockPredictor />
      </div>

      {/* Admin Section */}
      {userRole === "admin" && (
        <div className="mt-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
            <UserRoleManager currentUserId={session.user?.email || ""} />
          </div>
        </div>
      )}
    </div>
  );
}

