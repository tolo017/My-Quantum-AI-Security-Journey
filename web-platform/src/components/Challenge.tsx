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
    <div className="my-8 p-6 cyber-border bg-black/60 space-y-4">
      <div className="flex items-center gap-2 text-cyber-green font-bold uppercase tracking-tighter">
        <ShieldAlert className="w-5 h-5" />
        <span>Action Required: Knowledge Verification</span>
      </div>

      <div className="flex gap-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || "Type answer..."}
          className="flex-1 bg-cyber-dark border border-cyber-green/30 p-2 text-cyber-green outline-none focus:border-cyber-green"
        />
        <button
          onClick={verify}
          className="neon-button whitespace-nowrap"
        >
          EXECUTE
        </button>
      </div>

      {status === "success" && (
        <div className="flex items-center gap-2 text-cyber-green text-sm animate-pulse">
          <Check className="w-4 h-4" />
          <span>Access Granted. Challenge completed.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <X className="w-4 h-4" />
          <span>Unauthorized. Try again.</span>
        </div>
      )}
    </div>
  );
}
