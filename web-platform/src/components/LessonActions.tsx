"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Octokit } from "octokit";
import {
  ArrowLeft, ArrowRight, Share2, Twitter, Instagram, Github, CheckCircle2, AlertTriangle, X
} from "lucide-react";

interface LessonActionsProps {
  dayNumber: number;
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

  // Handle Mark Complete & Update GitHub
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
      setMessage("Session saved locally. Configure GitHub settings on the Home Page to push to your repository.");
      return;
    }

    try {
      setMessage("Connecting to GitHub API...");
      const octokit = new Octokit({ auth: githubToken });

      // Helper to update files (README.md and TIMETABLE.md)
      const updateFileCheckbox = async (filePath: string) => {
        let fileSha = "";
        let fileContent = "";

        try {
          const { data } = await octokit.rest.repos.getContent({
            owner: githubOwner,
            repo: githubRepo,
            path: filePath,
          });

          if (!Array.isArray(data) && data.type === "file") {
            fileSha = data.sha;
            fileContent = Buffer.from(data.content, "base64").toString("utf-8");
          }
        } catch (err) {
          throw new Error(`Could not fetch ${filePath} from GitHub repository.`);
        }

        // Replace checkbox for current day e.g. - [ ] **Day 10:** -> - [x] **Day 10:**
        // Support both README.md format (e.g. - [ ] **Day 10:** and - [ ] **Day 10**)
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

        await octokit.rest.repos.createOrUpdateFileContents({
          owner: githubOwner,
          repo: githubRepo,
          path: filePath,
          message: `✅ Complete Day ${dayNumber} Challenge [Beba Cyber Lab]`,
          content: Buffer.from(newContent).toString("base64"),
          sha: fileSha,
        });
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
    <div className="space-y-6 pt-8 border-t border-cyber-green/20">

      {/* Complete Button & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <button
          onClick={handleCompleteAndSubmit}
          disabled={status === "loading"}
          className={`w-full md:w-auto px-8 py-3 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all ${
            status === "loading"
              ? "bg-cyber-green/10 border border-cyber-green/40 text-cyber-green animate-pulse"
              : isCompleted
              ? "bg-cyber-green text-cyber-dark hover:shadow-[0_0_15px_#00FF41]"
              : "neon-button w-full"
          }`}
        >
          {status === "loading" ? (
            <span>SYNCHRONIZING SYS...</span>
          ) : isCompleted ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>SYNC TO GITHUB REPO</span>
            </>
          ) : (
            <span>COMPLETE & SUBMIT MISSION</span>
          )}
        </button>

        {/* Social Share Buttons */}
        <div className="flex gap-4 w-full md:w-auto">
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-cyber-green/40 hover:border-cyber-green hover:bg-cyber-green/10 text-xs py-2 px-4 transition-all"
          >
            <Twitter className="w-4 h-4" />
            <span>SHARE ON X</span>
          </a>
          <button
            onClick={() => setShowIGModal(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 border border-cyber-green/40 hover:border-cyber-green hover:bg-cyber-green/10 text-xs py-2 px-4 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>SHARE ON IG</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {status !== "idle" && (
        <div className={`p-4 border text-xs flex gap-3 ${
          status === "loading" ? "border-cyber-green/30 bg-cyber-green/5 text-cyber-green animate-pulse" :
          status === "success" ? "border-cyber-green/60 bg-cyber-green/10 text-cyber-green" :
          "border-red-500/50 bg-red-500/5 text-red-400"
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
      <div className="flex justify-between items-center border-t border-cyber-green/20 pt-6 mt-6">
        {dayNumber > 1 ? (
          <Link href={`/lessons/${prevDayStr}`}>
            <button className="flex items-center gap-2 text-xs border border-cyber-green/30 hover:border-cyber-green py-2 px-4 hover:bg-cyber-green/10 transition-all text-cyber-green font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span>DAY {prevDayStr}</span>
            </button>
          </Link>
        ) : (
          <div />
        )}

        <Link href="/">
          <span className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 hover:underline cursor-pointer">
            MAIN TERMINAL
          </span>
        </Link>

        {dayNumber < 72 ? (
          <Link href={`/lessons/${nextDayStr}`}>
            <button className="flex items-center gap-2 text-xs border border-cyber-green/30 hover:border-cyber-green py-2 px-4 hover:bg-cyber-green/10 transition-all text-cyber-green font-bold">
              <span>DAY {nextDayStr}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* INSTAGRAM MODAL */}
      {showIGModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full cyber-border bg-cyber-dark p-6 space-y-6 relative">
            <button
              onClick={() => setShowIGModal(false)}
              className="absolute top-4 right-4 text-cyber-green hover:text-white border border-cyber-green/40 px-2 py-0.5 text-xs"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-cyber-green/20 pb-3">
              <Instagram className="w-5 h-5 text-cyber-green" />
              <h3 className="text-sm font-bold uppercase text-white tracking-widest">Share on Instagram Stories/Feed</h3>
            </div>

            <div className="border border-cyber-green/30 p-4 bg-black/40 text-xs font-mono select-all h-60 overflow-y-auto whitespace-pre-wrap text-white opacity-90 leading-relaxed rounded">
              {instaCaption}
            </div>

            <p className="text-[10px] opacity-70">
              * Since Instagram doesn't support caption-sharing links, we have crafted a beautifully styled post description for you. Click below to copy it, then upload your lab screenshot!
            </p>

            <button
              onClick={copyInstaCaption}
              className="w-full neon-button py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              COPY POST CAPTION
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
