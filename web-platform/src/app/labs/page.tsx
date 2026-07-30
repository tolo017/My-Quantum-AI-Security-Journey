"use client";

import { Shield } from "lucide-react";
import LabWorkspace from "@/components/LabWorkspace";
import Link from "next/link";

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-[#070B13] text-[#F3F4F6] font-sans">

      {/* Premium Navigation Header */}
      <nav className="border-b border-slate-800 bg-[#0C1220]/80 backdrop-blur-md sticky top-0 z-40 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-lg">
              <Shield className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Beba <span className="text-indigo-400 font-medium">Cyber Labs</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Quantum & GenAI Educational Platform</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/">
              <button className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-xs py-2 px-4 rounded-md font-semibold transition-all text-slate-200">
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Lab Workspace */}
      <LabWorkspace />

    </main>
  );
}
