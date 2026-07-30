"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Share2, Twitter, Instagram, CheckCircle2, AlertTriangle, X
} from "lucide-react";

interface LessonActionsProps {
  dayNumber: number;
}

// Browser-safe base64 UTF-8 helpers (avoids Node's Buffer)
function utf8ToBase64(str: string): string {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str: string): string {
  // Remove newlines often present in GitHub's base64 response
  const cleaned = str.replace(/\s/g, "");
  return decodeURIComponent(escape(window.atob(cleaned)));
}

export default function LessonActions({ dayNumber }: LessonActionsProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showIGModal, setShowIGModal] = useState(false);

  // GitHub Settings
  const [githubToken, setGithubToken] = useState("");
  const [githubOwner, setGithubOwner] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  useEffect(() => {
    // Read completed days
    const saved = localStorage.getItem("beba_completed_days");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as number[];
        setCompletedDays(parsed);
        setIsCompleted(parsed.includes(dayNumber));
      } catch (e) {
        // Ignored
      }
    }

    // Read developer credentials
    setGithubToken(localStorage.getItem("beba_github_token") || "");
    setGithubOwner(localStorage.getItem("beba_github_owner") || "");
    setGithubRepo(localStorage.getItem("beba_github_repo") || "");
    setTwitterHandle(localStorage.getItem("beba_twitter_handle") || "BebaSecurity");
  }, [dayNumber]);

  // Handle Mark Complete & Update GitHub using Native Fetch (No Node dependencies/Buffer/Octokit runtime errors)
  const handleCompleteAndSubmit = async () => {
    setStatus("loading");
    setMessage("Initializing submission sequence...");

    // 1. Update LocalStorage
    let updatedDays = [...completedDays];
    if (!updatedDays.includes(dayNumber)) {
      updatedDays.push(dayNumber);
      updatedDays.sort((a, b) => a - b);
      setCompletedDays(updatedDays);
      setIsCompleted(true);
      localStorage.setItem("beba_completed_days", JSON.stringify(updatedDays));
    }

    // 2. Check if GitHub configuration is available
    if (!githubToken || !githubOwner || !githubRepo) {
      setStatus("success");
      setMessage("Session saved locally. Configure your GitHub credentials on the Home Page to push to your repository.");
      return;
    }

    try {
      setMessage("Connecting to GitHub API...");

      // Helper to update files (README.md and TIMETABLE.md) using native fetch
      const updateFileCheckbox = async (filePath: string) => {
        const url = `https://api.github.com/repos/${githubOwner}/${githubRepo}/contents/${filePath}`;

        // Fetch current file info
        const getRes = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Accept": "application/vnd.github.v3+json",
          },
        });

        if (!getRes.ok) {
          throw new Error(`Could not fetch ${filePath} (Status: ${getRes.status}). Ensure repo info and token are correct.`);
        }

        const data = await getRes.json();
        const fileSha = data.sha;
        const fileContent = base64ToUtf8(data.content);

        // Replace checkbox for current day e.g. - [ ] **Day 10:** -> - [x] **Day 10:**
        const targetRegex = new RegExp(`-\\s*\\[\\s*\\]\\s*\\*\\*Day\\s+${dayNumber}\\b`, 'g');
        const replacement = `- [x] **Day ${dayNumber}`;

        if (!targetRegex.test(fileContent)) {
          // Check if already checked
          const checkedRegex = new RegExp(`-\\s*\\[\\s*x\\s*\\]\\s*\\*\\*Day\\s+${dayNumber}\\b`, 'g');
          if (checkedRegex.test(fileContent)) {
            return; // Already checked, skip
          }
        }

        const newContent = fileContent.replace(targetRegex, replacement);

        // Put the updated file back
        const putRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${githubToken}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `✅ Complete Day ${dayNumber} Challenge [Beba Cyber Lab]`,
            content: utf8ToBase64(newContent),
            sha: fileSha,
          }),
        });

        if (!putRes.ok) {
          throw new Error(`Failed to update ${filePath} (Status: ${putRes.status}).`);
        }
      };

      setMessage("Updating TIMETABLE.md...");
      await updateFileCheckbox("TIMETABLE.md");

      setMessage("Updating README.md...");
      await updateFileCheckbox("README.md");

      setStatus("success");
      setMessage("Lab synchronization successful! TIMETABLE.md and README.md updated on GitHub.");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error?.message || "An unexpected system error occurred during synchronization.");
    }
  };

  // Social Sharing Content Generator
  const tweetText = `Just completed Day ${dayNumber} of my 72-Day Quantum & Generative AI Cybersecurity journey! 🚀💻 Learning how to secure and hack systems at the intersection of AI and cryptography. See my progress here: github.com/${githubOwner}/${githubRepo}`;
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const instaCaption = `Day ${dayNumber}/72: COMPLETE! ⚡🔒\n\nI'm deep into my 72-Day Cybersecurity: Quantum & Generative AI roadmap, and Day ${dayNumber} is officially conquered.\n\nBuilding project-based hacking labs, automating scripts in Python/Rust, and analyzing next-generation exploits.\n\nFollow my journey or star my repo:\n🔗 github.com/${githubOwner || "[username]"}/${githubRepo || "[repo-name]"}\n\n#Cybersecurity #QuantumComputing #GenerativeAI #Python #Rust #EthicalHacking #CodingLife #LearnInPublic`;

  const copyInstaCaption = () => {
    navigator.clipboard.writeText(instaCaption);
    alert("Instagram description copied to clipboard! Share on your stories or feed.");
  };

  const prevDayStr = String(dayNumber - 1).padStart(2, "0");
  const nextDayStr = String(dayNumber + 1).padStart(2, "0");

  return (
    <div className="space-y-6 pt-8 border-t border-slate-800">

      {/* Complete Button & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <button
          onClick={handleCompleteAndSubmit}
          disabled={status === "loading"}
          className={`w-full md:w-auto px-8 py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            status === "loading"
              ? "bg-slate-800 border border-slate-700 text-slate-400 animate-pulse"
              : isCompleted
              ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10"
          }`}
        >
          {status === "loading" ? (
            <span>Synchronizing...</span>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>Synced with GitHub</span>
            </>
          ) : (
            <span>Mark Complete & Submit</span>
          )}
        </button>

        {/* Social Share Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 text-xs py-2.5 px-4 rounded-lg font-semibold transition-all text-slate-200"
          >
            <Twitter className="w-4 h-4 text-[#1DA1F2]" />
            <span>Share on X</span>
          </a>
          <button
            onClick={() => setShowIGModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-600 hover:bg-slate-800 text-xs py-2.5 px-4 rounded-lg font-semibold transition-all text-slate-200"
          >
            <Instagram className="w-4 h-4 text-[#E1306C]" />
            <span>Share on IG</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {status !== "idle" && (
        <div className={`p-4 border rounded-lg text-xs flex gap-3 ${
          status === "loading" ? "border-indigo-500/20 bg-indigo-500/5 text-indigo-300 animate-pulse" :
          status === "success" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-300" :
          "border-rose-500/20 bg-rose-500/5 text-rose-400"
        }`}>
          {status === "error" ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
          <div>
            <strong className="block uppercase tracking-wider font-bold mb-1">
              {status === "loading" ? "Uplink in Progress" : status === "success" ? "Uplink Established" : "Uplink Failure"}
            </strong>
            <p className="opacity-90">{message}</p>
          </div>
        </div>
      )}

      {/* Lesson Navigation */}
      <div className="flex justify-between items-center border-t border-slate-800 pt-6 mt-6">
        {dayNumber > 1 ? (
          <Link href={`/lessons/${prevDayStr}`}>
            <button className="flex items-center gap-2 text-xs border border-slate-800 hover:border-slate-600 hover:bg-slate-800 py-2.5 px-4 rounded-lg transition-all text-slate-200 font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span>Day {prevDayStr}</span>
            </button>
          </Link>
        ) : (
          <div />
        )}

        <Link href="/">
          <span className="text-xs uppercase tracking-widest text-slate-400 hover:text-white hover:underline cursor-pointer font-bold">
            Back to Dashboard
          </span>
        </Link>

        {dayNumber < 72 ? (
          <Link href={`/lessons/${nextDayStr}`}>
            <button className="flex items-center gap-2 text-xs border border-slate-800 hover:border-slate-600 hover:bg-slate-800 py-2.5 px-4 rounded-lg transition-all text-slate-200 font-bold">
              <span>Day {nextDayStr}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* INSTAGRAM MODAL */}
      {showIGModal && (
        <div className="fixed inset-0 bg-[#050811]/95 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-slate-800 bg-[#0C1220] p-6 rounded-xl space-y-6 relative">
            <button
              onClick={() => setShowIGModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white border border-slate-800 px-2 py-0.5 rounded text-xs transition-all font-semibold"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Instagram className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">Share on Instagram Stories</h3>
            </div>

            <div className="border border-slate-800 p-4 bg-[#070B13] text-xs font-mono select-all h-60 overflow-y-auto whitespace-pre-wrap text-slate-200 opacity-90 leading-relaxed rounded-lg">
              {instaCaption}
            </div>

            <p className="text-[10px] text-slate-400 leading-normal">
              * Since Instagram does not support direct links, we've crafted a premium caption with hashtags. Copy it below, take a screenshot of your lab, and share your achievements!
            </p>

            <button
              onClick={copyInstaCaption}
              className="w-full btn-primary py-3 text-xs font-bold uppercase tracking-wider"
            >
              Copy Caption to Clipboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
