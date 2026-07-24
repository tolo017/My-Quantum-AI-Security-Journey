"use client";

import { useState } from "react";
import { Check, X, ShieldAlert } from "lucide-react";

interface ChallengeProps {
  id: string;
  correctAnswer: string;
  placeholder?: string;
}

export default function Challenge({ id, correctAnswer, placeholder }: ChallengeProps) {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const verify = () => {
    if (input.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="my-6 p-6 rounded-xl border border-slate-800 bg-[#0C1220] space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5 text-indigo-400 font-bold uppercase text-xs tracking-wider">
        <ShieldAlert className="w-4 h-4 text-indigo-400" />
        <span>Action Required: Knowledge Verification</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || "Type answer..."}
          className="flex-1 bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 font-medium text-sm transition-all"
        />
        <button
          onClick={verify}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-md transition-all whitespace-nowrap shadow-sm shadow-indigo-600/10"
        >
          Verify Answer
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <Check className="w-4 h-4" />
          <span>Access Granted. Challenge completed.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold">
          <X className="w-4 h-4" />
          <span>Unauthorized. Try again.</span>
        </div>
      )}
    </div>
  );
}
