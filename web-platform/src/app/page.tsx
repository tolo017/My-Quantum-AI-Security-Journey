"use client";

import { useState, useEffect } from "react";
import {
  Terminal, Shield, Award, Settings, CheckCircle2, Lock, Unlock,
  HelpCircle, Eye, EyeOff, Twitter, Instagram, Github, ArrowRight, BookOpen, Cpu, Globe, Crosshair, Briefcase, Bookmark, ChevronRight
} from "lucide-react";
import Link from "next/link";

// 72-Day Premium Curriculum Data
const PHASES = [
  {
    number: 1,
    title: "The Foundations",
    range: "Days 1 - 14",
    description: "Master the Linux command line, persistent Docker lab isolation, networking topologies, and basic cryptography.",
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
    description: "Use Python and Rust to construct production-grade offensive and defensive tooling.",
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
    description: "Audit and exploit Large Language Models. Master direct/indirect prompt injection and adversarial guardrails.",
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
    description: "Analyze the quantum threat. Deploy Post-Quantum Cryptography (PQC) lattice algorithms (Kyber, Dilithium).",
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
    description: "Synthesize AI and quantum principles. Secure quantum clouds and deploy defensive machine learning classifiers.",
    days: [
      { id: 57, title: "AI-Enhanced Quantum Attacks", topic: "Using AI to optimize Shor's", difficulty: "Advanced" },
      { id: 58, title: "Quantum-Resistant AI Models", topic: "Securing AI with PQC wrappers", difficulty: "Advanced" },
      { id: 59, title: "Adversarial ML in Quantum Era", topic: "Evasion of Quantum classifiers", difficulty: "Advanced" },
      { id: 60, title: "Automated Red Teaming", topic: "AI + PQC Orchestration", difficulty: "Advanced" },
      { id: 61, title: "Deepfakes & AI Social Eng", topic: "Synthetics, Cloning, Defenses", difficulty: "Intermediate" },
      { id: 62, title: "Detecting AI-generated Malware", topic: "Heuristics vs Machine Learning", difficulty: "Advanced" },
      { id: 63, title: "Securing the Quantum Cloud", topic: "APIs, Blind Quantum Computing", difficulty: "Advanced" },
      { id: 64, title: "Incident Response for AI/Q Breaches", topic: "Forensics, Key compromise", difficulty: "Advanced" },
      { id: 65, title: "Compliance, NIST & AI Acts", topic: "Regulation, Policies, Ethics", difficulty: "Intermediate" },
    ]
  },
  {
    number: 6,
    title: "Final Capstone Project",
    range: "Days 66 - 72",
    description: "Apply your elite training in a simulated attack, defense, lateral move, and remediation engagement.",
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

// Career role specifications for recruiters
const CAREER_PROFILES = [
  {
    role: "AI Red Teamer / LLM Auditor",
    salary: "$140,000 - $190,000 / year",
    description: "Evaluates generative AI pipelines, bypasses safety filters, and mitigates output handling compromises.",
    skills: "LLM Orchestrations, System Prompt Engineering, Python Exploits, Content Bypass, Agent Security",
    timeline: "Days 29 - 42"
  },
  {
    role: "Post-Quantum Cryptography Architect",
    salary: "$150,000 - $210,000 / year",
    description: "Architects and implements quantum-safe trust infrastructures, migrates legacy VPNs/SSL to NIST-approved lattice ciphers.",
    skills: "Lattice-Based Math, Kyber, Dilithium, OpenSSL PKI, Crypto-Agility, Side-Channel Audits",
    timeline: "Days 43 - 56"
  },
  {
    role: "Advanced DevSecOps / Cloud Auditor",
    salary: "$130,000 - $175,000 / year",
    description: "Hardens cloud microservice clusters, automates vulnerability scans, and builds secure, zero-trust network subnets.",
    skills: "Docker Isolation, Linux Namespaces, Bash Auditing, SSH Port Pivoting, Custom PKIs",
    timeline: "Days 1 - 14"
  }
];

export default function Dashboard() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [completedGuided, setCompletedGuided] = useState<number[]>([]);
  const [completedRogue, setCompletedRogue] = useState<number[]>([]);
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

    // Read completed guided & rogue labs
    const savedGuided = localStorage.getItem("beba_completed_guided_labs");
    const savedRogue = localStorage.getItem("beba_completed_rogue_labs");
    if (savedGuided) setCompletedGuided(JSON.parse(savedGuided));
    if (savedRogue) setCompletedRogue(JSON.parse(savedRogue));

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
    alert("Settings successfully saved!");
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
    if (confirm("Are you sure you want to reset your progress?")) {
      const defaultDays = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      setCompletedDays(defaultDays);
      localStorage.setItem("beba_completed_days", JSON.stringify(defaultDays));
      setCompletedGuided([]);
      setCompletedRogue([]);
      localStorage.removeItem("beba_completed_guided_labs");
      localStorage.removeItem("beba_completed_rogue_labs");
    }
  };

  const totalCompleted = completedDays.length;
  const percentage = ((totalCompleted / 72) * 100).toFixed(1);
  const totalFlags = completedGuided.length + completedRogue.length;

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
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-xs py-2 px-4 rounded-md font-semibold transition-all text-slate-200"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Platform Settings</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Side Sidebar - Learning Progress */}
        <div className="lg:col-span-1 space-y-6">
          <div className="saas-card p-6 rounded-xl space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3">
              Your Course Status
            </h3>

            <div className="space-y-5">
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block font-semibold">Current Rank</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Award className="w-4 h-4 text-indigo-400" />
                  <span>Quantum Practitioner</span>
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block font-semibold">Active Lab Merits</span>
                <span className="text-xs font-mono font-bold text-emerald-400 block mt-1 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg">
                  🏆 {totalFlags * 150} PTS ({totalFlags} Flags Captured)
                </span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wide block font-semibold">Course Completion</span>
                <div className="flex justify-between text-xs mt-1.5 mb-1.5 font-bold text-white">
                  <span>{totalCompleted} / 72 Days</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <button
                onClick={resetAllProgress}
                className="w-full text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/5 hover:border-red-500/30 py-2 rounded-md transition-all"
              >
                Reset Progress
              </button>
            </div>
          </div>

          <div className="saas-card p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Virtual Lab Containers</h3>
            </div>
            <ul className="text-xs space-y-2.5 text-slate-300 font-medium">
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Kali Linux Core Active
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Parrot Security Active
              </li>
              <li className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Isolated Docker Bridge Net
              </li>
            </ul>
          </div>
        </div>

        {/* Center Main Curriculum Content */}
        <div className="lg:col-span-3 space-y-10">

          {/* Main Hero Header Banner */}
          <div className="p-8 rounded-xl saas-card bg-gradient-to-r from-[#0C1220] via-[#0E1528] to-indigo-950/20 relative overflow-hidden">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Quantum Security & Generative AI Roadmap
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mb-6 leading-relaxed font-medium">
              Welcome to your professional cybersecurity academy. Explore, audit, and secure advanced systems. Deploy lattice-based post-quantum cryptography, run deepfake forensics, and compromise LLMs in a 100% virtualized Docker laboratory.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/labs">
                <button className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10">
                  <Crosshair className="w-4.5 h-4.5" />
                  <span>🔬 Open Virtual Range & Hands-On Labs</span>
                </button>
              </Link>
              <Link href="/interview">
                <button className="btn-primary flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/10">
                  <Briefcase className="w-4.5 h-4.5" />
                  <span>💼 Career Technical Interview Prep simulator</span>
                </button>
              </Link>
            </div>
          </div>

          {/* 💼 Career & Job Market Readiness Hub Section */}
          <div className="saas-card p-6 rounded-xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  💼 Cybersecurity Career & Job Market Readiness Hub
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">How your portfolio maps to elite jobs on the field</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Employers in the cybersecurity sector do not hire based on simple certificates; they hire based on <strong className="text-white">proven, demonstrable execution portfolio assets</strong>. Here is where the skills you are mastering in this roadmap map to high-paying job opportunities:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CAREER_PROFILES.map((profile, i) => (
                <div key={i} className="bg-[#050811] border border-slate-900/60 p-5 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold py-1 px-2.5 rounded">
                      {profile.timeline}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-tight">{profile.role}</h4>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block">{profile.salary}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{profile.description}</p>
                  <div className="pt-2 border-t border-slate-900/50">
                    <strong className="text-[9px] uppercase tracking-wider text-slate-500 block font-bold">Key Portfolio Assets:</strong>
                    <span className="text-[10px] text-slate-300 font-medium block mt-0.5 line-clamp-1">{profile.skills}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grouped Course Curriculum */}
          <div className="space-y-12">
            {PHASES.map((phase) => (
              <div key={phase.number} className="space-y-6">

                {/* Phase Title Block */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                      <span className="text-indigo-400 font-semibold">Phase {phase.number}:</span> {phase.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">{phase.description}</p>
                  </div>
                  <span className="text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 py-1.5 px-3 rounded-md mt-2 md:mt-0">
                    {phase.range}
                  </span>
                </div>

                {/* Day Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.days.map((day) => {
                    const isCompleted = completedDays.includes(day.id);
                    const isAvailable = day.id <= 10;

                    return (
                      <div
                        key={day.id}
                        className={`p-5 rounded-lg saas-card transition-all flex flex-col justify-between h-40 ${
                          isAvailable
                            ? "hover:border-indigo-500/30 cursor-pointer"
                            : "opacity-45 pointer-events-none"
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider">DAY {String(day.id).padStart(2, "0")}</span>
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
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10" />
                                ) : (
                                  <div className="w-5 h-5 border border-slate-700 rounded-full hover:border-indigo-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-sm text-white tracking-tight mt-2 line-clamp-1">
                            {day.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">
                            {day.topic}
                          </p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-800/60 pt-3 text-[11px] font-semibold">
                          <span className="text-slate-400">{day.difficulty}</span>
                          {isAvailable ? (
                            <Link href={`/lessons/${String(day.id).padStart(2, "0")}`} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                              <span>Open Lesson</span>
                              <Unlock className="w-3.5 h-3.5" />
                            </Link>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <span>Locked</span>
                              <Lock className="w-3.5 h-3.5" />
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

      {/* SECURE CONFIG MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-[#050811]/90 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full border border-slate-800 bg-[#0C1220] p-8 rounded-xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '4s' }} />
                <h3 className="text-lg font-bold text-white tracking-tight">Developer Sync & credentials</h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1 rounded text-xs transition-all font-semibold"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Link this web portal directly with your Git repository. All keys are stored safely and solely inside your web browser's <strong className="text-white">LocalStorage</strong>.
            </p>

            <form onSubmit={saveSettings} className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5">
                <label className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">GitHub Personal Access Token</label>
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">GitHub Owner</label>
                  <input
                    type="text"
                    value={githubOwner}
                    onChange={(e) => setGithubOwner(e.target.value)}
                    placeholder="e.g. github-username"
                    className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">Repo Name</label>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="e.g. 72-day-cyber-roadmap"
                    className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">Twitter X Handle</label>
                  <input
                    type="text"
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="e.g. MyHandle"
                    className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[11px] text-slate-300 font-bold uppercase tracking-wider">Instagram Handle</label>
                  <input
                    type="text"
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="e.g. my_insta_handle"
                    className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-4">
                <button
                  type="submit"
                  className="w-full btn-primary font-bold uppercase tracking-wide"
                >
                  Save settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
