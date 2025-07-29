"use client";
import { ReactNode } from "react";
import Navigation from "@/components/Navigation";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
} 