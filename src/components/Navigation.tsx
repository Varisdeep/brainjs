"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navigation() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">📈</div>
            <span>StockAnalytics</span>
          </Link>

          {/* Desktop Menu */}
          <div className="nav-menu">
            {session ? (
              <>
                <Link href="/dashboard" className="nav-link">Dashboard</Link>
                <Link href="/profile" className="nav-link">Profile</Link>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 gradient-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {session.user?.name || session.user?.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link">Sign In</Link>
                <Link href="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="block md:hidden p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white rounded-lg shadow-lg border">
            <div className="flex flex-col gap-4">
              {session ? (
                <>
                  <Link href="/dashboard" className="nav-link">Dashboard</Link>
                  <Link href="/profile" className="nav-link">Profile</Link>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-8 h-8 gradient-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {session.user?.name || session.user?.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          User
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full btn-secondary"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="nav-link">Sign In</Link>
                  <Link href="/register" className="btn-primary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 