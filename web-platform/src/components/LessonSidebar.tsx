"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2, Lock, Unlock, ArrowLeft, Shield, BookOpen, ChevronDown, ChevronRight
} from "lucide-react";

interface LessonSidebarProps {
  currentDay: number;
}

const PHASES = [
  {
    number: 1,
    title: "Foundations",
    days: [
      { id: 1, title: "Environment Setup" },
      { id: 2, title: "Linux Power User" },
      { id: 3, title: "Networking Fundamentals I" },
      { id: 4, title: "Networking Fundamentals II" },
      { id: 5, title: "Virtualization & Lab Isolation" },
      { id: 6, title: "Basic Cryptography" },
      { id: 7, title: "Hashing & PKI" },
      { id: 8, title: "The Hacker's Methodology" },
      { id: 9, title: "Web Vulnerabilities I" },
      { id: 10, title: "Web Vulnerabilities II" },
      { id: 11, title: "Python for Automation" },
      { id: 12, title: "Rust for Systems Security" },
      { id: 13, title: "Python Port Scanner" },
      { id: 14, title: "Rust File Integrity Checker" },
    ]
  },
  {
    number: 2,
    title: "Programming for Hackers",
    days: [
      { id: 15, title: "Scapy Packet Manipulation" },
      { id: 16, title: "Request-based Exploits" },
      { id: 17, title: "Rust Memory Safety" },
      { id: 18, title: "Multi-threaded Net Tool in Rust" },
      { id: 19, title: "Malware Analysis 101" },
      { id: 20, title: "Python Keylogger" },
      { id: 21, title: "Rust Ransomware Simulator" },
      { id: 22, title: "Rust Ransomware Decryptor" },
      { id: 23, title: "Shellcoding & Buffer Overflows" },
      { id: 24, title: "Memory Corruptions" },
      { id: 25, title: "Fuzzing with Python/Rust" },
      { id: 26, title: "API Security & Auto Tests" },
      { id: 27, title: "Rust CLI Security Toolkit" },
      { id: 28, title: "Phase 2 Review: Integration" },
    ]
  },
  {
    number: 3,
    title: "Generative AI Security",
    days: [
      { id: 29, title: "How LLMs Work" },
      { id: 30, title: "Local LLM Orchestration" },
      { id: 31, title: "Prompt Injection" },
      { id: 32, title: "Defensive Prompt Engineering" },
      { id: 33, title: "Data Poisoning Attacks" },
      { id: 34, title: "Insecure Output Handling" },
      { id: 35, title: "LLM Agent Attack Surfaces" },
      { id: 36, title: "Training Data Extraction" },
      { id: 37, title: "Jailbreaking Techniques" },
      { id: 38, title: "Bypassing Content Filters" },
      { id: 39, title: "Building an AI Firewall" },
      { id: 40, title: "AI-Assisted Exploit Dev" },
      { id: 41, title: "AI-Driven Vuln Research" },
      { id: 42, title: "Red Teaming LLM Apps" },
    ]
  },
  {
    number: 4,
    title: "Quantum Security & PQC",
    days: [
      { id: 43, title: "Quantum Computing Basics" },
      { id: 44, title: "Shor's Algorithm" },
      { id: 45, title: "Grover's Algorithm" },
      { id: 46, title: "Harvest Now, Decrypt Later" },
      { id: 47, title: "Post-Quantum Cryptography" },
      { id: 48, title: "Lattice-Based Cryptography" },
      { id: 49, title: "Kyber & Dilithium Lab" },
      { id: 50, title: "QKD vs PQC" },
      { id: 51, title: "Python Qiskit Circuits" },
      { id: 52, title: "Breaking Toy RSA with Shor's" },
      { id: 53, title: "Migrating to PQC" },
      { id: 54, title: "PQC Side-Channel Attacks" },
      { id: 55, title: "Quantum-Safe VPNs" },
      { id: 56, title: "Quantum ML Security" },
    ]
  },
  {
    number: 5,
    title: "Hybrid Attacks & Defense",
    days: [
      { id: 57, title: "AI-Enhanced Quantum Attacks" },
      { id: 58, title: "Quantum-Resistant AI Models" },
      { id: 59, title: "Adversarial ML in Quantum Era" },
      { id: 60, title: "Automated Red Teaming" },
      { id: 61, title: "Deepfakes & AI Social Eng" },
      { id: 62, title: "Detecting AI Malware" },
      { id: 63, title: "Securing the Quantum Cloud" },
      { id: 64, title: "Incident Response for AI/Q" },
      { id: 65, title: "Compliance, NIST & AI Acts" },
    ]
  },
  {
    number: 6,
    title: "Final Capstone Project",
    days: [
      { id: 66, title: "Project Design" },
      { id: 67, title: "AI Vulnerability Discovery" },
      { id: 68, title: "Jailbreaking & Lateral Move" },
      { id: 69, title: "PQC Exfiltration" },
      { id: 70, title: "White Hat Defense" },
      { id: 71, title: "Report & Remediation" },
      { id: 72, title: "Graduation" },
    ]
  }
];

export default function LessonSidebar({ currentDay }: LessonSidebarProps) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true, // Auto-expand current active phase
  });

  useEffect(() => {
    const saved = localStorage.getItem("beba_completed_days");
    if (saved) {
      try {
        setCompletedDays(JSON.parse(saved));
      } catch (e) {}
    }

    // Auto expand the phase containing currentDay
    PHASES.forEach((phase) => {
      const containsDay = phase.days.some(d => d.id === currentDay);
      if (containsDay) {
        setOpenPhases(prev => ({ ...prev, [phase.number]: true }));
      }
    });
  }, [currentDay]);

  const togglePhase = (phaseNum: number) => {
    setOpenPhases(prev => ({ ...prev, [phaseNum]: !prev[phaseNum] }));
  };

  return (
    <aside className="w-80 border-r border-slate-800/80 bg-[#0C1220] h-[calc(100vh-65px)] overflow-y-auto sticky top-[65px] hidden lg:block select-none">
      <div className="p-5 space-y-6">

        {/* Navigation back button */}
        <div className="pb-3 border-b border-slate-800/60">
          <Link href="/">
            <button className="w-full flex items-center justify-center gap-2 text-xs border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 py-2.5 rounded-lg transition-all text-slate-300 font-bold">
              <ArrowLeft className="w-4 h-4 text-slate-400" />
              <span>Back to Dashboard</span>
            </button>
          </Link>
        </div>

        {/* Course Directory Title */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Learning Syllabus</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-medium">72-Day Educational Center</p>
        </div>

        {/* Phases list */}
        <div className="space-y-4">
          {PHASES.map((phase) => {
            const isOpen = !!openPhases[phase.number];
            return (
              <div key={phase.number} className="space-y-1.5">
                {/* Phase Header Accordion */}
                <button
                  onClick={() => togglePhase(phase.number)}
                  className="w-full flex items-center justify-between text-left p-2 hover:bg-slate-800/30 rounded-md transition-all group"
                >
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1">
                    P{phase.number}: {phase.title}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>

                {/* Days list */}
                {isOpen && (
                  <div className="pl-2 border-l border-slate-800/80 ml-2.5 space-y-1">
                    {phase.days.map((day) => {
                      const isCompleted = completedDays.includes(day.id);
                      const isAvailable = day.id <= 10;
                      const isActive = day.id === currentDay;

                      const content = (
                        <div className={`flex items-center justify-between text-left p-2 rounded-md transition-all text-xs font-medium cursor-pointer ${
                          isActive
                            ? "bg-indigo-600/10 text-indigo-300 border border-indigo-500/30"
                            : isAvailable
                            ? "text-slate-300 hover:bg-slate-800/40 hover:text-white"
                            : "text-slate-500 pointer-events-none opacity-60"
                        }`}>
                          <div className="flex items-center gap-2 overflow-hidden">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0" />
                            )}
                            <span className="truncate">Day {day.id}: {day.title}</span>
                          </div>
                          {!isAvailable && <Lock className="w-3 h-3 text-slate-600 flex-shrink-0" />}
                        </div>
                      );

                      if (isAvailable) {
                        return (
                          <Link key={day.id} href={`/lessons/${String(day.id).padStart(2, "0")}`}>
                            {content}
                          </Link>
                        );
                      }

                      return <div key={day.id}>{content}</div>;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </aside>
  );
}
