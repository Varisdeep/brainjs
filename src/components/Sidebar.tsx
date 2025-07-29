"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

// Sidebar navigation links for authenticated users
const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/stocks", label: "Stocks" },
  { href: "/profile", label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen w-64 bg-white border-r shadow-lg flex flex-col fixed top-0 left-0 z-40">
      <div className="flex items-center justify-center h-20 border-b">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">StockPro</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2 p-6">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              pathname === link.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-8 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </nav>
      <div className="p-4 text-xs text-gray-400 text-center border-t">&copy; 2025 StockPro</div>
    </aside>
  );
} 