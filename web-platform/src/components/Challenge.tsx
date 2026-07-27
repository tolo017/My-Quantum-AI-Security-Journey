"use client";

import { useState } from "react";
import { Terminal, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

interface ChallengeProps {
  id: string;
  correctAnswer: string;
  placeholder?: string;
}

export default function Challenge({ id, correctAnswer, placeholder }: ChallengeProps) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const currentInput = input;
    setStatus("idle");

    // Add prompt to output log
    const newLogs = [...logs, `guest@beba-cyberlabs:~$ ${currentInput}`];

    if (currentInput.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      setStatus("success");
      setLogs([...newLogs, "Verifying checksum authentication token...", "✔ SUCCESS: Command executed successfully! Access granted.", "System state updated."]);
    } else {
      setStatus("error");
      setLogs([...newLogs, "Verifying checksum authentication token...", `❌ ERROR: command not found or invalid response: "${currentInput}"`, "Please try again or consult the lesson notes above."]);
    }
  };

  const handleReset = () => {
    setInput("");
    setLogs([]);
    setStatus("idle");
  };

  return (
    <div className="my-8 rounded-xl border border-slate-800 bg-[#070B13] shadow-2xl overflow-hidden max-w-2xl">
      {/* Terminal Title Bar */}
      <div className="bg-[#0C1220] px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Window Control Buttons */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400 ml-2 tracking-tight flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>beba-cyber-terminal (guest@beba-labs)</span>
          </span>
        </div>

        <button
          onClick={handleReset}
          title="Reset Terminal"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Screen Body */}
      <div className="p-5 font-mono text-xs md:text-sm space-y-3.5 text-slate-300 min-h-[140px] bg-[#050811] leading-relaxed">

        {/* Welcome Text */}
        <div className="text-slate-500 text-[11px] border-b border-slate-900/60 pb-2 mb-2">
          <span>Beba Labs Interactive Shell v1.0.2 • Type answer and hit Enter or click Run Command</span>
        </div>

        {/* Existing Command History Logs */}
        {logs.map((log, index) => {
          let logClass = "text-slate-300";
          if (log.startsWith("✔")) logClass = "text-emerald-400 font-bold";
          if (log.startsWith("❌")) logClass = "text-rose-400 font-bold";
          if (log.startsWith("guest@")) logClass = "text-indigo-400";
          if (log.startsWith("Verifying")) logClass = "text-slate-500 italic";

          return (
            <div key={index} className={logClass}>
              {log}
            </div>
          );
        })}

        {/* Current Active Input Prompt Line */}
        {status !== "success" ? (
          <form onSubmit={handleVerify} className="flex items-center gap-2 text-indigo-400">
            <span className="font-bold shrink-0">guest@beba-cyberlabs:~$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder || "type answer..."}
              className="flex-1 bg-transparent text-slate-200 outline-none border-none p-0 focus:ring-0 placeholder-slate-700 font-mono font-medium text-xs md:text-sm caret-indigo-400"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </form>
        ) : (
          <div className="text-emerald-400 font-bold flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg mt-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>CONGRATULATIONS: Laboratory verification checksum is secure! You can proceed to the next session.</span>
          </div>
        )}
      </div>

      {/* Action Tray */}
      {status !== "success" && (
        <div className="px-5 py-3 bg-[#0C1220] border-t border-slate-800/80 flex justify-end gap-3">
          <button
            onClick={() => handleVerify()}
            className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5"
          >
            <span>Run Command</span>
            <Terminal className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
