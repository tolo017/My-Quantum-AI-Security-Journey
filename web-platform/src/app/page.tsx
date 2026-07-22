"use client";

import { useState, useEffect } from "react";
import {
  Terminal, Shield, Award, Settings, CheckCircle2, Lock, Unlock,
  HelpCircle, Eye, EyeOff, Twitter, Instagram, Github, RefreshCw
} from "lucide-react";
import Link from "next/link";

// 72-Day Curriculum Data
const PHASES = [
  {
    number: 1,
    title: "The Foundations",
    range: "Days 1 - 14",
    description: "Master the environment, the command line, and how data moves.",
    days: [
      { id: 1, title: "Environment Setup", topic: "Zorin OS, Python, Rust, Docker", difficulty: "Beginner" },
      { id: 2, title: "Linux Power User", topic: "Bash, Filesystems, Permissions", difficulty: "Beginner" },
      { id: 3, title: "Networking Fundamentals I", topic: "OSI Model, TCP/IP, DNS", difficulty: "Beginner" },
      { id: 4, title: "Networking Fundamentals II", topic: "HTTP/S, SSH, Wireshark", difficulty: "Beginner" },
      { id: 5, title: "Virtualization & Lab Isolation", topic: "Hypervisors, Docker, Sandboxes", difficulty: "Beginner" },
      { id: 6, title: "Basic Cryptography", topic: "Symmetric vs Asymmetric Encryption", difficulty: "Beginner" },
      { id: 7, title: "Hashing & PKI", topic: "Integrity, Signatures, PKI", difficulty: "Beginner" },
      { id: 8, title: "The Hacker's Methodology", topic: "Recon, Scan, Exploit, Post", difficulty: "Beginner" },
      { id: 9, title: "Web Vulnerabilities I", topic: "SQLi, XSS, Command Injection", difficulty: "Beginner" },
      { id: 10, title: "Web Vulnerabilities II", topic: "IDOR, File Inclusion, CSRF", difficulty: "Intermediate" },
      { id: 11, title: "Python for Automation", topic: "Scripting, Automating Tasks", difficulty: "Intermediate" },
      { id: 12, title: "Rust for Systems Security", topic: "Memory, Types, Safety", difficulty: "Intermediate" },
      { id: 13, title: "Python Port Scanner", topic: "Socket Programming, Scanning", difficulty: "Intermediate" },
      { id: 14, title: "Rust File Integrity Checker", topic: "Hashing, CLI tools in Rust", difficulty: "Intermediate" },
    ]
  },
  {
    number: 2,
    title: "Programming for Hackers",
    range: "Days 15 - 28",
    description: "Use Python and Rust to build offensive and defensive tools.",
    days: [
      { id: 15, title: "Scapy Packet Manipulation", topic: "Custom Packets, Sniffing", difficulty: "Intermediate" },
      { id: 16, title: "Request-based Exploits", topic: "HTTP Automation, Exploiting API", difficulty: "Intermediate" },
      { id: 17, title: "Rust Memory Safety", topic: "Ownership, Borrowing, Lifetimes", difficulty: "Intermediate" },
      { id: 18, title: "Multi-threaded Net Tool in Rust", topic: "Concurrency, Sockets, Threadpools", difficulty: "Advanced" },
      { id: 19, title: "Malware Analysis 101", topic: "Static Analysis, Disassembly", difficulty: "Intermediate" },
      { id: 20, title: "Python Keylogger", topic: "API Hooking, Key Logging", difficulty: "Intermediate" },
      { id: 21, title: "Rust Ransomware Simulator", topic: "Crypto APIs, Directory Walkers", difficulty: "Advanced" },
      { id: 22, title: "Rust Ransomware Decryptor", topic: "Symmetric Decryption, Safety", difficulty: "Advanced" },
      { id: 23, title: "Shellcoding & Buffer Overflows", topic: "Stack, Assembly, Payloads", difficulty: "Advanced" },
      { id: 24, title: "Memory Corruptions & Unsafe", topic: "Rust Unsafe, Pointers", difficulty: "Advanced" },
      { id: 25, title: "Fuzzing with Python/Rust", topic: "AFL, Radamsa, Bug Hunting", difficulty: "Advanced" },
      { id: 26, title: "API Security & Auto Tests", topic: "REST, JWT, OAuth Hacking", difficulty: "Intermediate" },
      { id: 27, title: "Rust CLI Security Toolkit", topic: "Clap, Tool Compilation", difficulty: "Intermediate" },
      { id: 28, title: "Phase 2 Review: Integration", topic: "Tool Integration, Orchestration", difficulty: "Intermediate" },
    ]
  },
  {
    number: 3,
    title: "Generative AI Security",
    range: "Days 29 - 42",
    description: "Red and White Hat techniques for Large Language Models.",
    days: [
      { id: 29, title: "How LLMs Work", topic: "Transformers, Attention, Weights", difficulty: "Intermediate" },
      { id: 30, title: "Local LLM Orchestration", topic: "Ollama, Llama.cpp, GPU", difficulty: "Intermediate" },
      { id: 31, title: "Prompt Injection", topic: "Direct vs Indirect Attacks", difficulty: "Intermediate" },
      { id: 32, title: "Defensive Prompt Engineering", topic: "System Prompts, Sandboxing", difficulty: "Intermediate" },
      { id: 33, title: "Data Poisoning Attacks", topic: "Training Set Corruption", difficulty: "Advanced" },
      { id: 34, title: "Insecure Output Handling", topic: "XSS via LLM, Code Execution", difficulty: "Intermediate" },
      { id: 35, title: "LLM Agent Attack Surfaces", topic: "Tool Use, Autonomy Exploits", difficulty: "Advanced" },
      { id: 36, title: "Training Data Extraction", topic: "Privacy Attacks, Membership Inference", difficulty: "Advanced" },
      { id: 37, title: "Jailbreaking Techniques", topic: "DAN, Adversarial Suffixes", difficulty: "Intermediate" },
      { id: 38, title: "Bypassing Content Filters", topic: "Moderation Bypasses", difficulty: "Intermediate" },
      { id: 39, title: "Building an AI Firewall", topic: "Input/Output Sanitization", difficulty: "Advanced" },
      { id: 40, title: "AI-Assisted Exploit Dev", topic: "Using LLMs for Scripting", difficulty: "Intermediate" },
      { id: 41, title: "AI-Driven Vulnerability Research", topic: "Static Code Scanning via AI", difficulty: "Advanced" },
      { id: 42, title: "Red Teaming LLM Apps", topic: "Complete Assessment Lab", difficulty: "Advanced" },
    ]
  },
  {
    number: 4,
    title: "Quantum Security & PQC",
    range: "Days 43 - 56",
    description: "Understanding the Quantum threat and the new defense standards.",
    days: [
      { id: 43, title: "Quantum Computing Basics", topic: "Qubits, Superposition, Entanglement", difficulty: "Intermediate" },
      { id: 44, title: "Shor's Algorithm", topic: "RSA and ECC Decimation Theory", difficulty: "Advanced" },
      { id: 45, title: "Grover's Algorithm", topic: "Symmetric Key Search Space Reduction", difficulty: "Advanced" },
      { id: 46, title: "Harvest Now, Decrypt Later", topic: "Eavesdropping, National Threats", difficulty: "Intermediate" },
      { id: 47, title: "Intro to Post-Quantum Cryptography", topic: "NIST Round 4 Standards", difficulty: "Intermediate" },
      { id: 48, title: "Lattice-Based Cryptography", topic: "Shortest Vector Problem, Mathematics", difficulty: "Advanced" },
      { id: 49, title: "Kyber & Dilithium Lab", topic: "PQC Algorithm Implementations", difficulty: "Advanced" },
      { id: 50, title: "QKD vs PQC", topic: "Quantum Key Distribution, Fiber Optics", difficulty: "Intermediate" },
      { id: 51, title: "Python Qiskit Circuits", topic: "Quantum Simulators in Python", difficulty: "Intermediate" },
      { id: 52, title: "Breaking Toy RSA with Shor's", topic: "Python Shor's Simulation", difficulty: "Advanced" },
      { id: 53, title: "Migrating to PQC", topic: "Infrastructure Crypto-Agility", difficulty: "Advanced" },
      { id: 54, title: "PQC Side-Channel Attacks", topic: "Timing, Power Analysis of Lattice", difficulty: "Advanced" },
      { id: 55, title: "Quantum-Safe VPNs", topic: "PQC WireGuard / OpenVPN", difficulty: "Advanced" },
      { id: 56, title: "Quantum ML Security", topic: "QML Attacks and Adversarial QML", difficulty: "Advanced" },
    ]
  },
  {
    number: 5,
    title: "Hybrid Attacks & Advanced Defense",
    range: "Days 57 - 65",
    description: "Combining AI and Quantum for high-end Cybersecurity.",
    days: [
      { id: 57, title: "AI-Enhanced Quantum Attacks", topic: "Using AI to optimize Shor's", difficulty: "Advanced" },
      { id: 58, title: "Quantum-Resistant AI Models", topic: "Securing AI with PQC wrappers", difficulty: "Advanced" },
      { id: 59, title: "Adversarial ML in Quantum Era", topic: "Evasion of Quantum classifiers", difficulty: "Advanced" },
      { id: 60, title: "Automated Red Teaming", topic: "AI + PQC Orchestration", difficulty: "Advanced" },
      { id: 61, title: "Deepfakes & AI Social Eng", topic: "Synthetics, Cloning, Defenses", difficulty: "Intermediate" },
      { id: 62, title: "Detecting AI-generated Malware", topic: "Heuristics vs Machine Learning", difficulty: "Advanced" },
      { id: 63, title: "Securing the Quantum Cloud", topic: "APIs, Blind Quantum Computing", difficulty: "Advanced" },
      { id: 64, title: "Incident Response for AI/Q Breaches", topic: "Breach forensics, Key compromise", difficulty: "Advanced" },
      { id: 65, title: "Compliance, NIST & AI Acts", topic: "Regulation, Policies, Ethics", difficulty: "Intermediate" },
    ]
  },
  {
    number: 6,
    title: "Final Capstone Project",
    range: "Days 66 - 72",
    description: "Execute a multi-stage attack and defense simulation.",
    days: [
      { id: 66, title: "Project Design", topic: "Infrastructure blueprinting", difficulty: "Advanced" },
      { id: 67, title: "AI Vulnerability Discovery", topic: "Recon & Auto scan", difficulty: "Advanced" },
      { id: 68, title: "Jailbreaking & Lateral Move", topic: "Stage 1 Intrusion", difficulty: "Advanced" },
      { id: 69, title: "PQC Exfiltration", topic: "Stage 2 Data Theft", difficulty: "Advanced" },
      { id: 70, title: "White Hat Defense", topic: "Hardening, AI-SOC, Patching", difficulty: "Advanced" },
      { id: 71, title: "Report & Remediation", topic: "Documentation, Fix strategies", difficulty: "Intermediate" },
      { id: 72, title: "Graduation", topic: "Review, Certification, Final notes", difficulty: "Expert" },
    ]
  }
];

export default function Dashboard() {
  // Configured default completed days: Days 1-9 are completed
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showToken, setShowToken] = useState(false);

  // Settings states
  const [githubToken, setGithubToken] = useState("");
  const [githubOwner, setGithubOwner] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");

  useEffect(() => {
    // Read completed days
    const saved = localStorage.getItem("beba_completed_days");
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {
        setCompletedDays([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      }
    } else {
      const defaultDays = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      setCompletedDays(defaultDays);
      localStorage.setItem("beba_completed_days", JSON.stringify(defaultDays));
    }

    // Read Settings
    setGithubToken(localStorage.getItem("beba_github_token") || "");
    setGithubOwner(localStorage.getItem("beba_github_owner") || "");
    setGithubRepo(localStorage.getItem("beba_github_repo") || "");
    setTwitterHandle(localStorage.getItem("beba_twitter_handle") || "BebaSecurity");
    setInstagramHandle(localStorage.getItem("beba_instagram_handle") || "beba_security");
  }, []);

  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("beba_github_token", githubToken);
    localStorage.setItem("beba_github_owner", githubOwner);
    localStorage.setItem("beba_github_repo", githubRepo);
    localStorage.setItem("beba_twitter_handle", twitterHandle);
    localStorage.setItem("beba_instagram_handle", instagramHandle);
    setShowSettings(false);
    alert("System Configurations Updated Successfully!");
  };

  const toggleDayStatus = (id: number) => {
    let updated;
    if (completedDays.includes(id)) {
      updated = completedDays.filter(d => d !== id);
    } else {
      updated = [...completedDays, id].sort((a, b) => a - b);
    }
    setCompletedDays(updated);
    localStorage.setItem("beba_completed_days", JSON.stringify(updated));
  };

  const resetAllProgress = () => {
    if (confirm("Are you sure you want to reset all progress back to Day 9?")) {
      const defaultDays = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      setCompletedDays(defaultDays);
      localStorage.setItem("beba_completed_days", JSON.stringify(defaultDays));
    }
  };

  const totalCompleted = completedDays.length;
  const percentage = ((totalCompleted / 72) * 100).toFixed(1);

  return (
    <main className="min-h-screen bg-cyber-dark text-cyber-green font-mono pb-20">
      {/* Dynamic scan line and backdrop grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:40px_40px] opacity-[0.07] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-[2px] bg-cyber-green/20 animate-pulse pointer-events-none z-50" />

      {/* Navigation Header */}
      <nav className="border-b border-cyber-green/30 bg-black/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyber-green animate-pulse" />
            <div>
              <h1 className="text-xl font-bold uppercase tracking-tighter text-white">
                BEBA BEBA <span className="text-cyber-green">CYBER LABS</span>
              </h1>
              <p className="text-[9px] opacity-60 tracking-widest uppercase">Quantum & GenAI Mastery Platform</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 border border-cyber-green/40 hover:border-cyber-green hover:bg-cyber-green/10 text-xs py-2 px-3 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>CONFIG.SYS</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Stats & Settings Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="cyber-border p-6 bg-black/60 backdrop-blur-sm space-y-6">
            <div className="border-b border-cyber-green/30 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">System Status</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase opacity-50 block">Clearance Level</span>
                <span className="text-sm font-semibold tracking-wide text-white">LEVEL 4 - QUANTUM PRACTITIONER</span>
              </div>
              <div>
                <span className="text-[10px] uppercase opacity-50 block">Uptime</span>
                <span className="text-sm font-semibold text-white">100% ONLINE</span>
              </div>
              <div>
                <span className="text-[10px] uppercase opacity-50 block">Course Progress</span>
                <div className="flex justify-between text-xs mt-1 mb-2 font-bold">
                  <span>{totalCompleted} / 72 DAYS</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-cyber-dark border border-cyber-green/20 overflow-hidden relative">
                  <div
                    className="h-full bg-cyber-green transition-all duration-500 shadow-[0_0_8px_rgba(0,255,65,0.7)]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-cyber-green/20 pt-4 flex gap-2">
              <button
                onClick={resetAllProgress}
                className="w-full text-[10px] border border-red-500/50 text-red-400 hover:bg-red-500/10 py-1 px-2 transition-all"
              >
                RESET PROGRESS
              </button>
            </div>
          </div>

          <div className="cyber-border p-6 bg-black/60 backdrop-blur-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white border-b border-cyber-green/20 pb-2">Active Lab Stack</h3>
            <ul className="text-[11px] space-y-2 opacity-80">
              <li className="flex items-center gap-2">🟢 Kali Linux Container</li>
              <li className="flex items-center gap-2">🟢 Parrot Sec Container</li>
              <li className="flex items-center gap-2">🟢 Docker DMZ Network</li>
              <li className="flex items-center gap-2">🟢 VSCode & PyCharm</li>
              <li className="flex items-center gap-2">🟢 Local Rust Toolchain</li>
            </ul>
          </div>
        </div>

        {/* Center / Right Dashboard Content */}
        <div className="lg:col-span-3 space-y-8">

          {/* Header Banner */}
          <div className="p-8 cyber-border bg-gradient-to-r from-black/80 to-cyber-green/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Terminal className="w-32 h-32" />
            </div>
            <h2 className="text-4xl font-extrabold uppercase tracking-tighter text-white mb-2">
              QUANTUM & AI ROADMAP
            </h2>
            <p className="text-sm max-w-xl opacity-80 mb-6 leading-relaxed">
              An intensive cyber-engineering roadmap covering prompt injections, deepfake defense, lattice-based cryptography, and side-channel exploits. Execute labs daily to claim graduation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/lessons/10">
                <button className="neon-button text-xs font-bold flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  <span>INITIALIZE DAY 10 MISSION</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Curriculum Phases Accordion / List */}
          <div className="space-y-8">
            {PHASES.map((phase) => (
              <div key={phase.number} className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-cyber-green/40 pb-2">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-widest text-white flex items-center gap-2">
                      <span className="text-cyber-green">PHASE {phase.number}:</span> {phase.title}
                    </h3>
                    <p className="text-xs opacity-60 mt-1">{phase.description}</p>
                  </div>
                  <span className="text-xs font-mono uppercase bg-cyber-green/10 text-cyber-green border border-cyber-green/30 py-1 px-2.5 rounded mt-2 md:mt-0">
                    {phase.range}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.days.map((day) => {
                    const isCompleted = completedDays.includes(day.id);
                    // Currently, let user access any of the first 10 days since they are physically in web-platform
                    const isAvailable = day.id <= 10;

                    return (
                      <div
                        key={day.id}
                        className={`p-4 cyber-border bg-black/40 backdrop-blur-sm transition-all flex flex-col justify-between h-40 ${
                          isAvailable
                            ? "hover:bg-cyber-green/[0.04] border-cyber-green/40 hover:border-cyber-green cursor-pointer"
                            : "opacity-40 border-cyber-green/10"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold tracking-widest opacity-60">DAY {String(day.id).padStart(2, "0")}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleDayStatus(day.id);
                                }}
                                title="Toggle Complete Status"
                                className="hover:scale-110 transition-transform"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4.5 h-4.5 text-cyber-green fill-cyber-green/20" />
                                ) : (
                                  <div className="w-4 h-4 border border-cyber-green/40 rounded-full hover:border-cyber-green" />
                                )}
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm text-white uppercase mt-2 tracking-tight line-clamp-1">
                            {day.title}
                          </h4>
                          <p className="text-[11px] opacity-70 mt-1 line-clamp-2">
                            {day.topic}
                          </p>
                        </div>

                        <div className="flex justify-between items-center border-t border-cyber-green/10 pt-2 text-[10px] uppercase font-bold tracking-wider">
                          <span className="opacity-60">{day.difficulty}</span>
                          {isAvailable ? (
                            <Link href={`/lessons/${String(day.id).padStart(2, "0")}`} className="text-cyber-green hover:underline flex items-center gap-1">
                              <span>ACCESS LAB</span>
                              <Unlock className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span className="text-red-500/70 flex items-center gap-1">
                              <span>LOCKED</span>
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* CONFIG MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full cyber-border bg-cyber-dark p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-cyber-green/30 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyber-green animate-spin" />
                <h3 className="text-lg font-bold uppercase text-white tracking-widest">CONFIG.SYS PANEL</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="hover:text-white border border-cyber-green/40 px-2 py-0.5 text-xs"
              >
                ESC
              </button>
            </div>

            <p className="text-xs opacity-70 leading-relaxed">
              Provide credentials to link this web dashboard directly with your local files and GitHub repository. All keys are stored completely in your browser's <strong className="text-white">LocalStorage</strong> for maximum security.
            </p>

            <form onSubmit={saveSettings} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-wider font-bold">GitHub Personal Access Token</label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-black/80 border border-cyber-green/30 p-2.5 text-cyber-green outline-none focus:border-cyber-green pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-2.5 opacity-60 hover:opacity-100"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-bold">Repo Owner</label>
                  <input
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    placeholder="e.g. github-username"
                    className="w-full bg-black/80 border border-cyber-green/30 p-2.5 text-cyber-green outline-none focus:border-cyber-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-bold">Repo Name</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="e.g. 72-day-cyber-roadmap"
                    className="w-full bg-black/80 border border-cyber-green/30 p-2.5 text-cyber-green outline-none focus:border-cyber-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-bold">Twitter X Handle</label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="e.g. MyHandle"
                    className="w-full bg-black/80 border border-cyber-green/30 p-2.5 text-cyber-green outline-none focus:border-cyber-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase tracking-wider font-bold">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="e.g. my_insta_handle"
                    className="w-full bg-black/80 border border-cyber-green/30 p-2.5 text-cyber-green outline-none focus:border-cyber-green"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-cyber-green/20 flex gap-4">
                <button
                  type="submit"
                  className="w-full neon-button py-2.5 font-bold uppercase tracking-wider"
                >
                  SAVE CONFIGURATIONS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
