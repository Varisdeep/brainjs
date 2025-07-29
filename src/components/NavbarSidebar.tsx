"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

// Navigation links for the application
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export default function NavbarSidebar() {
  // State management for navigation and authentication
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <nav className="relative">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-30">
        <div className="text-xl font-bold tracking-tight">Stock Market</div>
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Login</Link>
              <Link href="/register" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Register</Link>
            </>
          ) : (
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Profile</Link>
          )}
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-gray-700 border-gray-400 hover:text-blue-600 hover:border-blue-600 focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <span className="text-lg font-bold">Menu</span>
          <button
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-4 p-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn && (
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
          )}
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors" onClick={() => setSidebarOpen(false)}>Login</Link>
              <Link href="/register" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors" onClick={() => setSidebarOpen(false)}>Register</Link>
            </>
          ) : (
            <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium text-lg transition-colors" onClick={() => setSidebarOpen(false)}>Profile</Link>
          )}
        </nav>
      </aside>
    </nav>
  );
} 