import { Terminal, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-dark bg-cyber-grid bg-[size:50px_50px] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter text-cyber-green cyber-glow">
            BEBA BEBA <span className="text-white">SECURITY LAB</span>
          </h1>
          <p className="text-xl text-cyber-green opacity-80 uppercase tracking-widest">
            Quantum & Generative AI Cyber Roadmap
          </p>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="cyber-border p-8 bg-black/40 backdrop-blur-sm space-y-4 group hover:border-cyber-purple transition-all">
            <Terminal className="w-12 h-12 mb-2 text-cyber-green group-hover:text-cyber-purple" />
            <h2 className="text-2xl font-bold uppercase">The Lab</h2>
            <p className="text-sm opacity-70">Interactive command-line challenges and hands-on lab orchestration.</p>
            <Link href="/lessons/10" className="block">
              <button className="neon-button w-full mt-4">Initialize Session</button>
            </Link>
          </div>

          <div className="cyber-border p-8 bg-black/40 backdrop-blur-sm space-y-4 group hover:border-cyber-purple transition-all">
            <BookOpen className="w-12 h-12 mb-2 text-cyber-green group-hover:text-cyber-purple" />
            <h2 className="text-2xl font-bold uppercase">Curriculum</h2>
            <p className="text-sm opacity-70">72 Days of quantum-safe and AI-driven cybersecurity training.</p>
            <Link href="/lessons/08" className="block">
              <button className="neon-button w-full mt-4">View Roadmap</button>
            </Link>
          </div>
        </div>

        {/* Progress Footer */}
        <div className="pt-12 border-t border-cyber-green/20">
          <div className="flex justify-between items-center text-xs uppercase tracking-widest opacity-50">
            <span>Uptime: 100%</span>
            <span>Security Level: Authorized</span>
            <span>System Status: Optimal</span>
          </div>
        </div>
      </div>
    </main>
  );
}
