"use client";

import { useState, useEffect, useRef } from "react";
import {
  Terminal, Shield, Globe, Lock, Unlock, Server, RefreshCw, CheckCircle2,
  AlertTriangle, Play, HelpCircle, ArrowLeft, Download, FileText, Briefcase, Video, StopCircle, Award
} from "lucide-react";
import Link from "next/link";

// 10 Day Dual-CTF (Guided vs Independent Rogue) Missions
const LAB_MISSIONS = [
  {
    day: 1,
    title: "Docker Range Orchestration",
    client: "Beba Cyber Labs Intern Test",
    difficulty: "Beginner",
    objective: "Verify container orchestrations and retrieve secret namespace flags.",
    targetIP: "10.10.10.5",
    // Dual Flags
    guidedFlag: "FLAG{BEBA_DOCKER_GUIDED_42}",
    rogueFlag: "FLAG{BEBA_DOCKER_ROGUE_88}",
    instructions: [
      "CTF #1 (Guided): Inspect the Docker cluster structure using 'docker ps' and view the guided secret: 'cat /var/secrets/flag.txt'",
      "CTF #2 (Rogue): Use 'docker network ls' to find the hidden backend network name, and inspect the internal DB settings using 'cat /etc/hosts' to exfiltrate the rogue flag!"
    ],
    hint: "For the Rogue CTF, check '/etc/hosts' on the target node. The flag is commented at the bottom."
  },
  {
    day: 2,
    title: "Linux SUID Privilege Audit",
    client: "Apex Financial Systems (Freelance)",
    difficulty: "Beginner",
    objective: "Identify and exploit misconfigured SUID binaries to retrieve root keys.",
    targetIP: "10.10.20.12",
    guidedFlag: "FLAG{SUID_AUDIT_PASS_12}",
    rogueFlag: "FLAG{SUID_ROGUE_ESCAPE_99}",
    instructions: [
      "CTF #1 (Guided): SSH into the auditor shell 'ssh auditor@10.10.20.12' and find SUID binaries with 'find /usr/bin -perm -4000'. Open the default helper: 'cat /root/root_flag.txt'",
      "CTF #2 (Rogue): The rogue helper binary at '/usr/bin/audit_privileged_helper' has an injection exploit. Pass the argument 'system_dump' to run it as root and read the secure memory flag!"
    ],
    hint: "Rogue CTF requires you to run 'audit_privileged_helper system_dump' inside your SSH terminal session."
  },
  {
    day: 3,
    title: "DNS Subdomain Harvesting",
    client: "MedTech Global (Pentest)",
    difficulty: "Beginner",
    objective: "Exploit misconfigured DNS Zone Transfers (AXFR) to leak staging configurations.",
    targetIP: "10.10.30.5",
    guidedFlag: "FLAG{DNS_AXFR_HARVEST_55}",
    rogueFlag: "FLAG{DNS_ROGUE_TX_LEAK_33}",
    instructions: [
      "CTF #1 (Guided): Retrieve nameservers using 'dig NS medtech.local', then execute zone transfer using 'dig axfr medtech.local'.",
      "CTF #2 (Rogue): A hidden TXT record exists on the rogue subdomain 'secure-db.medtech.local'. Query it directly with 'dig txt secure-db.medtech.local' to exfiltrate the flag!"
    ],
    hint: "Rogue CTF requires querying the 'TXT' record of 'secure-db.medtech.local' directly."
  },
  {
    day: 4,
    title: "SSH SOCKS Tunnel pivoting",
    client: "Global Logistics Group",
    difficulty: "Beginner",
    objective: "Configure SOCKS5 dynamic forward proxy links to bypass egress firewalls.",
    targetIP: "10.10.40.80",
    guidedFlag: "FLAG{SSH_SOCKS_DYNAMIC_80}",
    rogueFlag: "FLAG{SSH_ROGUE_SOCKS_PORT_21}",
    instructions: [
      "CTF #1 (Guided): Establish SOCKS5 dynamic forward proxy 'ssh -D 1080 -N user@10.10.40.80' and read gateway page with 'curl --socks5 localhost:1080 http://internal.logistics.local'.",
      "CTF #2 (Rogue): Identify the rogue SSH administrative back-channel on port 8022. Tunnel port 8022 to local port 9022, and curl the secure database flag from 'http://localhost:9022'!"
    ],
    hint: "Use '-L 9022:localhost:8022' local forwarding on the target SSH node."
  },
  {
    day: 5,
    title: "Namespace breakout & docker escape",
    client: "SaaS Dev Corp (Cloud Audit)",
    difficulty: "Beginner",
    objective: "Audit container namespace privileges and verify absolute host isolation.",
    targetIP: "10.10.50.15",
    guidedFlag: "FLAG{DOCKER_ESCAPE_CHECK_10}",
    rogueFlag: "FLAG{DOCKER_ROGUE_CAP_SYS_ADMIN}",
    instructions: [
      "CTF #1 (Guided): View isolated network names 'docker network ls' and query container namespace limits with 'docker exec -it db_service cat /proc/self/status'.",
      "CTF #2 (Rogue): The container is running with CAP_SYS_ADMIN privileges. Exploit this escape by mounting the host device '/dev/sda1' and viewing the root flag: 'cat /host/mnt/root_secret.txt'!"
    ],
    hint: "Perform an explicit filesystem check on the '/host/mnt/' volume path to retrieve the Rogue flag."
  },
  {
    day: 6,
    title: "Cryptographic payload decoder",
    client: "SecureBank SA (Forensics)",
    difficulty: "Beginner",
    guidedFlag: "FLAG{AES_GCM_DECODE_VAULT_77}",
    rogueFlag: "FLAG{AES_ROGUE_KEY_CRACK_12}",
    objective: "Decrypt a captured confidential payload using AES-256-GCM authenticated cipher.",
    targetIP: "10.10.60.4",
    instructions: [
      "CTF #1 (Guided): Extract the encrypter parameters from '/backup/vault.enc' and run your decoder tool: 'python3 secure_backup.py /backup/vault.enc'.",
      "CTF #2 (Rogue): The encryption key was derived with a weak 4-character password salt. Launch a rogue brute-force decrypter to solve the key and read the transaction payload!"
    ],
    hint: "Brute-force the short salt password of 'vault.enc' using python scripts to unlock the Rogue flag."
  },
  {
    day: 7,
    title: "Forged Certificate signature",
    client: "TrustRoot Inc (PKI Audit)",
    difficulty: "Beginner",
    objective: "Verify PKI trust chains and signature validity for secure wildcard domains.",
    targetIP: "10.10.70.30",
    guidedFlag: "FLAG{PKI_ROOT_CHAIN_VALID_99}",
    rogueFlag: "FLAG{PKI_ROGUE_SELF_SIGNED_44}",
    instructions: [
      "CTF #1 (Guided): Inspect the certificate signature path using 'openssl x509 -in /certs/server.crt -text' and verify: 'openssl verify -CAfile /certs/rootCA.pem /certs/server.crt'.",
      "CTF #2 (Rogue): Auditing reveals a fraudulent wildcard certificate at '/certs/rogue.crt'. Find the spoofed issuer common name (CN) signature inside rogue.crt using openssl to exfiltrate the flag!"
    ],
    hint: "Run 'openssl x509 -in /certs/rogue.crt -noout -issuer' to view the rogue certificate issuer."
  },
  {
    day: 8,
    title: "Evasion Network Port scan",
    client: "defense Cloud Networks",
    difficulty: "Beginner",
    objective: "Execute stealthy TCP scanning to bypass passive IDS triggers.",
    targetIP: "10.10.80.1",
    guidedFlag: "FLAG{NMAP_STEALTH_SYN_SCAN_22}",
    rogueFlag: "FLAG{NMAP_ROGUE_DECOY_BYPASS_11}",
    instructions: [
      "CTF #1 (Guided): Execute stealth half-open SYN scan: 'sudo nmap -sS -p 80,443,22 10.10.80.1' and audit the IDS logs in '/var/log/ids_events.log'.",
      "CTF #2 (Rogue): Trigger a decoy scan with 4 spoofed IP addresses to obscure your true source scanning IP: 'sudo nmap -sS -D 10.10.80.5,10.10.80.6 10.10.80.1' and read the obfuscation flag!"
    ],
    hint: "Execute the decoy flag option '-D' with Nmap against the target IP to trigger the Rogue flag."
  },
  {
    day: 9,
    title: "Blind SQLi database harvest",
    client: "E-Commerce Retailer",
    difficulty: "Beginner",
    objective: "Exploit Boolean-Based Blind SQL injection to exfiltrate database user passwords.",
    targetIP: "10.10.90.100",
    guidedFlag: "FLAG{BLIND_SQLI_SUCCESS_66}",
    rogueFlag: "FLAG{BLIND_ROGUE_TIME_DELAY_33}",
    instructions: [
      "CTF #1 (Guided): Launch your automated Python script 'python3 blind_sqli.py 10.10.90.100' to exfiltrate the default admin database token.",
      "CTF #2 (Rogue): The web server added an input-rate throttle. Exploit this by utilizing a Time-Based Blind SQL Injection query: 'admin' AND IF(1=1, SLEEP(5), 0) --' to verify vulnerability and extract the flag!"
    ],
    hint: "For Rogue CTF, simulate a time-delay sql execution on the target to trigger the secure flag response."
  },
  {
    day: 10,
    title: "LFI Source code extraction",
    client: "Federal Core Portal (Gov Pentest)",
    difficulty: "Intermediate",
    objective: "Bypass file extension appending using PHP filter wrappers to read administrative configurations.",
    targetIP: "10.10.100.22",
    guidedFlag: "FLAG{PHP_WRAPPER_SOURCE_LEAK_44}",
    rogueFlag: "FLAG{PHP_ROGUE_RCE_WRAPPER_99}",
    instructions: [
      "CTF #1 (Guided): Read Unix files with directory traversal: 'curl http://10.10.100.22/view.php?page=../../../../etc/passwd' and dump config: 'curl http://10.10.100.22/view.php?page=php://filter/convert.base64-encode/resource=config'.",
      "CTF #2 (Rogue): Escalate the Local File Inclusion (LFI) to Remote Code Execution (RCE) by leveraging the PHP 'input' wrapper stream. POST custom php shellcode payload using curl to retrieve the root shell!"
    ],
    hint: "The payload uses the 'php://input' wrapper combined with POST data payloads containing system shellcodes."
  }
];

export default function LabWorkspace() {
  const [activeLab, setActiveLab] = useState(1);
  const [activeTerminalTab, setActiveTerminalTab] = useState<"mission" | "sandbox">("mission");

  // Terminal logs state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Beba Cyber Lab Console v3.0.0 • Interactive Shell Online.",
    "Type 'help' to view available range exploration commands."
  ]);
  const [sandboxLogs, setSandboxLogs] = useState<string[]>([
    "Beba Free Linux Sandbox Core • Session Initialized.",
    "Practice any Linux commands, python scripting, or test payloads freely in this independent workspace."
  ]);

  const [terminalInput, setTerminalInput] = useState("");
  const [sandboxInput, setSandboxInput] = useState("");

  // Flag completion statuses
  const [guidedFlagInput, setGuidedFlagInput] = useState("");
  const [rogueFlagInput, setRogueFlagInput] = useState("");
  const [completedGuided, setCompletedGuided] = useState<number[]>([]);
  const [completedRogue, setCompletedRogue] = useState<number[]>([]);

  // Screen recorder states
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const sandboxEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load local storage completions
    const guidedSaved = localStorage.getItem("beba_completed_guided_labs");
    const rogueSaved = localStorage.getItem("beba_completed_rogue_labs");
    if (guidedSaved) setCompletedGuided(JSON.parse(guidedSaved));
    if (rogueSaved) setCompletedRogue(JSON.parse(rogueSaved));
  }, []);

  // Auto Scroll Consoles
  useEffect(() => {
    if (activeTerminalTab === "mission") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      sandboxEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs, sandboxLogs, activeTerminalTab]);

  const currentMission = LAB_MISSIONS.find(m => m.day === activeLab) || LAB_MISSIONS[0];

  // Screen Recorder Start / Stop
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `beba-cyber-lab-recording-${new Date().toISOString().slice(0,10)}.webm`;
        a.click();
        stream.getTracks().forEach(track => track.stop());
        setRecording(false);
        alert("🎥 Screen Recording completed successfully! WebM video file downloaded.");
      };

      setMediaRecorder(recorder);
      setRecordedChunks([]);
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting screen record session: ", err);
      alert("Could not initialize display capture interface. Please grant necessary tab/screen permissions.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
  };

  // Target command simulation logic (Mission Terminal)
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const input = terminalInput.trim();
    const cmd = input.toLowerCase().split(" ")[0];
    const args = input.split(" ").slice(1);

    let response: string[] = [];
    response.push(`guest@beba-labs:~$ ${input}`);

    if (cmd === "help") {
      response.push(
        "Range Hacking & Exploration Commands:",
        "  help                           Display command catalog",
        "  clear                          Flush terminal window",
        "  ping <ip>                      Ping lab target nodes",
        "  nmap <options> <ip>            Scan network ports and services",
        "  ssh <user>@<ip>                Execute SSH sessions",
        "  dig <options> <domain>         Harvest domain DNS database",
        "  curl <url>                     Send client URL payloads",
        "  docker <options>               Query range container states",
        "  openssl <options>              Audit SSL certificates",
        "  python3 <script>               Execute automation tools",
        "  cat <file>                     Exfiltrate specific file streams"
      );
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else {
      // Stateful range command simulations
      switch (cmd) {
        case "ping":
          const ip = args[0] || "";
          if (ip === currentMission.targetIP) {
            response.push(
              `64 bytes from ${ip}: icmp_seq=1 ttl=64 time=4.32 ms`,
              `64 bytes from ${ip}: icmp_seq=2 ttl=64 time=4.12 ms`,
              "--- statistics --- 2 packets transmitted, 2 received, 0% loss"
            );
          } else {
            response.push(`ping: select target address: ${currentMission.targetIP}`);
          }
          break;

        case "docker":
          if (activeLab === 1) {
            if (input.includes("network ls")) {
              response.push(
                "NETWORK ID     NAME                  DRIVER    SCOPE",
                "d92b8a8df0b2   secure_cyber_range    bridge    local",
                "a19f82d029bc   backend_isolate_net   bridge    local"
              );
            } else if (input.includes("ps")) {
              response.push(
                "CONTAINER ID   IMAGE                 COMMAND                  PORTS",
                "a19df2b8f882   vulhub/php:8.1        \"docker-php-entryp...\"   10.10.10.5:80->80/tcp",
                "f92d8329b38c   alpine:latest         \"sleep infinity\"         lab_attacker_sandbox"
              );
            } else {
              response.push("Usage: docker ps | docker network ls");
            }
          } else if (activeLab === 5) {
            if (input.includes("network ls")) {
              response.push(
                "NETWORK ID     NAME                  DRIVER    SCOPE",
                "77b2d8f88c3a   secure_lab_bridge     bridge    local"
              );
            } else if (input.includes("exec -it db_service cat /proc/self/status")) {
              response.push(
                "Name:   db_service",
                "State:  R (running)",
                "CapInh: 0000000000200000 (CAP_SYS_ADMIN enabled!)",
                `[Guided flag:] ${currentMission.guidedFlag}`
              );
            } else {
              response.push("docker: execute privilege check queries corresponding to Day 5.");
            }
          } else {
            response.push("docker: daemon active.");
          }
          break;

        case "ssh":
          const target = args[0] || "";
          if (activeLab === 2 && target === "auditor@10.10.20.12") {
            response.push(
              "[*] Handshake verified. SSH authorization succeeded.",
              "auditor@apex-host:~$ "
            );
          } else {
            response.push(`ssh: connection refused. Check user credentials.`);
          }
          break;

        case "find":
          if (activeLab === 2) {
            response.push(
              "/usr/bin/passwd",
              "/usr/bin/audit_privileged_helper  <-- [!] SUID Set"
            );
          } else {
            response.push("find: completed.");
          }
          break;

        case "audit_privileged_helper":
          if (activeLab === 2 && input.includes("system_dump")) {
            response.push(
              "[*] Booting privileged helper dump system...",
              "[-] Dropping user context ID...",
              "[+] Escalate capabilities. Running command as root (UID 0)...",
              `[✔] EXFILTRATED DUMP: ${currentMission.rogueFlag}`
            );
          } else {
            response.push("audit_privileged_helper: Permission denied (Requires root argument 'system_dump').");
          }
          break;

        case "dig":
          const argDom = args[args.length - 1] || "";
          if (activeLab === 3) {
            if (argDom === "medtech.local" && input.includes("axfr")) {
              response.push(
                "medtech.local.          IN      NS      ns1.medtech.local.",
                "ns1.medtech.local.      IN      A       10.10.30.5",
                `staging.medtech.local.  IN      TXT     "FLAG=${currentMission.guidedFlag}"`,
                "secure-db.medtech.local. IN     A       10.10.30.9"
              );
            } else if (argDom === "secure-db.medtech.local" && input.includes("txt")) {
              response.push(
                ";; ANSWER SECTION:",
                `secure-db.medtech.local. IN     TXT     "FLAG=${currentMission.rogueFlag}"`
              );
            } else {
              response.push("dig: Query resolved. Try zone transfer 'axfr' or target 'txt' queries.");
            }
          } else {
            response.push("dig: host unreachable.");
          }
          break;

        case "curl":
          const url = args[args.length - 1] || "";
          if (activeLab === 4) {
            if (input.includes("--socks5 localhost:1080") && url.includes("internal.logistics.local")) {
              response.push(
                "HTTP/1.1 200 OK",
                `Payload Flag: ${currentMission.guidedFlag}`
              );
            } else if (input.includes("localhost:9022")) {
              response.push(
                "HTTP/1.1 200 OK",
                `Rogue Backchannel Flag: ${currentMission.rogueFlag}`
              );
            } else {
              response.push("curl: Blocked. Internal routing firewall dropped packet.");
            }
          } else if (activeLab === 10) {
            if (url.includes("php://filter/convert.base64-encode/resource=config")) {
              response.push(
                "HTTP/1.1 200 OK",
                "",
                "PD9waHAKLy8gQ29yZSBjb25maWcKJGZsYWcgPSAiRkxBR3tQSFBfV1JBUFBFUl9TT1VSQ0VfTEVBS180NH0iOwo/Pg=="
              );
            } else if (url.includes("../../../../etc/passwd")) {
              response.push("root:x:0:0:root:/root:/bin/bash");
            } else if (input.includes("-d") && url.includes("php://input")) {
              response.push(
                "[*] Executing Remote Code via PHP Input stream wrapper...",
                "[-] Spawning shell output: ID root (UID 0)",
                `[✔] EXFILTRATED FLAG: ${currentMission.rogueFlag}`
              );
            } else {
              response.push("LFI Target node accessible. Pass parameter page.");
            }
          } else {
            response.push(`curl: failed connecting to ${url}`);
          }
          break;

        case "openssl":
          if (activeLab === 7) {
            if (input.includes("server.crt") && input.includes("verify")) {
              response.push(
                "server.crt: OK",
                `Verified signature: ${currentMission.guidedFlag}`
              );
            } else if (input.includes("rogue.crt") && input.includes("-noout -issuer")) {
              response.push(
                `issuer= C = US, O = FraudulentTrust, CN = ${currentMission.rogueFlag}`
              );
            } else {
              response.push("openssl: use arguments matching Day 7 instructions.");
            }
          } else {
            response.push("openssl: completed.");
          }
          break;

        case "python3":
          const script = args[0] || "";
          if (activeLab === 6) {
            if (script === "secure_backup.py") {
              response.push(
                "[*] Deriving PBKDF2 GCM encryption key...",
                `[✔] Decrypted Payload: ${currentMission.guidedFlag}`
              );
            } else if (script.includes("brute")) {
              response.push(
                "[*] Launching rogue decryption brute force on weak salt...",
                "[+] Salt collision found! Password salt match: 0x92f8",
                `[✔] Decrypted Rogue Payload: ${currentMission.rogueFlag}`
              );
            } else {
              response.push("python3: executed script file.");
            }
          } else if (activeLab === 9) {
            if (script === "blind_sqli.py") {
              response.push(
                "[*] Extracting token character by character...",
                `[✔] Extracted Guided Flag: ${currentMission.guidedFlag}`
              );
            } else {
              response.push("python3: execution complete.");
            }
          } else {
            response.push("python3: compiled successfully.");
          }
          break;

        case "cat":
          const file = args[0] || "";
          if (activeLab === 1 && file === "/var/secrets/flag.txt") {
            response.push(`[Guided Flag:] ${currentMission.guidedFlag}`);
          } else if (activeLab === 1 && file === "/etc/hosts") {
            response.push(
              "127.0.0.1  localhost",
              `# Rogue Flag: ${currentMission.rogueFlag}`
            );
          } else if (activeLab === 2 && file === "/root/root_flag.txt") {
            response.push(`[Guided flag:] ${currentMission.guidedFlag}`);
          } else if (activeLab === 5 && file === "/host/mnt/root_secret.txt") {
            response.push(
              "[*] Reading mounted host system partition root path...",
              `[Rogue escape flag:] ${currentMission.rogueFlag}`
            );
          } else {
            response.push(`cat: ${file}: No such file or directory.`);
          }
          break;

        default:
          response.push(`bash: ${cmd}: command not found. Type 'help' for assist.`);
          break;
      }
    }

    setTerminalLogs(prev => [...prev, ...response]);
    setTerminalInput("");
  };

  // Open Ended Practice Free Sandbox Shell
  const handleSandboxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxInput.trim()) return;

    const input = sandboxInput.trim();
    const cmd = input.toLowerCase().split(" ")[0];
    let response: string[] = [];
    response.push(`sandbox@beba-cyberlabs:~$ ${input}`);

    if (cmd === "help") {
      response.push(
        "Beba Sandbox Commands:",
        "  help                           Show commands",
        "  clear                          Flush sandbox console",
        "  python3 -c \"<code>\"            Run Python scripts on the fly",
        "  echo <text>                    Print text outputs",
        "  ls -la                         Verify sandbox folder directories",
        "  uname -a                       Inspect virtual Linux kernel specs"
      );
    } else if (cmd === "clear") {
      setSandboxLogs([]);
      setSandboxInput("");
      return;
    } else if (cmd === "ls") {
      response.push(
        "drwxr-xr-x  2 sandbox sandbox 4096 Jul 28 12:00 .",
        "drwxr-xr-x  1 root    root    4096 Jul 28 12:00 ..",
        "-rw-r--r--  1 sandbox sandbox 1042 Jul 28 12:00 exploit_template.py",
        "-rwxr-xr-x  1 sandbox sandbox 2048 Jul 28 12:00 port_scanner.py"
      );
    } else if (cmd === "uname") {
      response.push("Linux beba-sandbox-core 5.15.0-88-generic #98-Ubuntu SMP x86_64 GNU/Linux");
    } else if (cmd === "python3") {
      response.push(
        "[*] Booting sandbox Python 3 interpreter environment...",
        "Script output compiled and ran successfully with 0 exceptions."
      );
    } else if (cmd === "echo") {
      response.push(input.split(" ").slice(1).join(" "));
    } else {
      response.push(`sandbox-shell: command output for '${cmd}' compiled correctly.`);
    }

    setSandboxLogs(prev => [...prev, ...response]);
    setSandboxInput("");
  };

  const handleVerifyGuided = (e: React.FormEvent) => {
    e.preventDefault();
    if (guidedFlagInput.trim() === currentMission.guidedFlag) {
      const updated = [...completedGuided];
      if (!updated.includes(activeLab)) {
        updated.push(activeLab);
        setCompletedGuided(updated);
        localStorage.setItem("beba_completed_guided_labs", JSON.stringify(updated));
      }
      alert("🎉 CONGRATULATIONS: Guided CTF Challenge secure! Flags verified.");
      setGuidedFlagInput("");
    } else {
      alert("❌ INCORRECT GUIDED FLAG. Audit your command pipeline.");
    }
  };

  const handleVerifyRogue = (e: React.FormEvent) => {
    e.preventDefault();
    if (rogueFlagInput.trim() === currentMission.rogueFlag) {
      const updated = [...completedRogue];
      if (!updated.includes(activeLab)) {
        updated.push(activeLab);
        setCompletedRogue(updated);
        localStorage.setItem("beba_completed_rogue_labs", JSON.stringify(updated));
      }
      alert("🏆 MASTERMIND EXECUTION: Independent Rogue CTF verified successfully!");
      setRogueFlagInput("");
    } else {
      alert("❌ INCORRECT ROGUE FLAG. Exploit variables need refinement!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Upper Navigation Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 bg-slate-900/60 p-2.5 rounded-lg transition-all text-xs font-bold">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </Link>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-400" />
              <span>Beba Security Hands-On Labs</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">State-Aware Terminal Playground & Dual Gamified CTF Challenges</p>
          </div>
        </div>

        {/* Screen Recorder Control Panel Widget */}
        <div className="flex items-center gap-4 bg-[#0C1220] border border-slate-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Video className="w-4 h-4 text-indigo-400" />
            <span>Screen Recorder Widget:</span>
          </div>
          {recording ? (
            <button
              onClick={handleStopRecording}
              className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition-all shadow-md animate-pulse"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>STOP RECORDING</span>
            </button>
          ) : (
            <button
              onClick={handleStartRecording}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-1.5 px-3 rounded flex items-center gap-1.5 transition-all shadow-md"
            >
              <Video className="w-3.5 h-3.5" />
              <span>START RECORDING</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual Workspace Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Hand Mission Control Pane (Col span 5) */}
        <div className="lg:col-span-5 space-y-6">

          {/* Lab Selector Select Form */}
          <div className="saas-card p-5 rounded-xl space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Active Range Lab Target:</label>
            <select
              value={activeLab}
              onChange={(e) => setActiveLab(Number(e.target.value))}
              className="w-full bg-[#070B13] border border-slate-800 rounded-md p-3 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-all font-semibold"
            >
              {LAB_MISSIONS.map(m => (
                <option key={m.day} value={m.day}>
                  Day {m.day}: {m.title} [{m.difficulty}]
                </option>
              ))}
            </select>
          </div>

          {/* Lab Target Metadata & Briefing Document */}
          <div className="saas-card p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contract Briefing Document</h3>
            </div>

            <div className="space-y-3.5 text-xs font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Client Target</span>
                  <span className="text-white font-bold">{currentMission.client}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Target IP Range</span>
                  <span className="text-indigo-400 font-mono font-bold">{currentMission.targetIP}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Primary Mission Objective</span>
                <p className="text-slate-300 leading-relaxed mt-0.5">{currentMission.objective}</p>
              </div>

              {/* Lab Guided Instructions Accordion */}
              <div className="space-y-1.5 border-t border-slate-900 pt-3">
                <span className="text-[10px] text-indigo-400 uppercase block font-bold">Guided Execution Steps:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  {currentMission.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Dual CTF Submission Banners */}
          <div className="saas-card p-5 rounded-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dual CTF Flag Certification</h3>
            </div>

            {/* CTF #1 Guided Submit Form */}
            <form onSubmit={handleVerifyGuided} className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                <span>🚩 CTF #1: Guided Operations</span>
                {completedGuided.includes(activeLab) ? (
                  <span className="text-emerald-400">✔ VERIFIED (+150 PTS)</span>
                ) : (
                  <span className="text-rose-400">UNSOLVED</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guidedFlagInput}
                  onChange={(e) => setGuidedFlagInput(e.target.value)}
                  placeholder="FLAG{guided_hash}"
                  className="flex-1 bg-[#070B13] border border-slate-800 rounded-md p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-4 rounded text-xs font-bold text-white whitespace-nowrap">
                  Submit
                </button>
              </div>
            </form>

            {/* CTF #2 Independent Rogue Submit Form */}
            <form onSubmit={handleVerifyRogue} className="space-y-2 pt-3 border-t border-slate-900/60">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
                <span>🏆 CTF #2: Rogue Operations (Independent)</span>
                {completedRogue.includes(activeLab) ? (
                  <span className="text-emerald-400">✔ VERIFIED (+150 PTS)</span>
                ) : (
                  <span className="text-amber-500">UNSOLVED</span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rogueFlagInput}
                  onChange={(e) => setRogueFlagInput(e.target.value)}
                  placeholder="FLAG{rogue_hash}"
                  className="flex-1 bg-[#070B13] border border-slate-800 rounded-md p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 px-4 rounded text-xs font-bold text-white whitespace-nowrap">
                  Submit
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Hand Live Hacker Console (Col span 7) */}
        <div className="lg:col-span-7 flex flex-col h-full space-y-6">

          {/* Tab Selection Header Bar */}
          <div className="flex border-b border-slate-800/80 bg-[#0C1220] p-1.5 rounded-lg gap-2">
            <button
              onClick={() => setActiveTerminalTab("mission")}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all ${
                activeTerminalTab === "mission"
                  ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              📟 Day-{activeLab} Target Range Shell
            </button>
            <button
              onClick={() => setActiveTerminalTab("sandbox")}
              className={`flex-1 text-center py-2 text-xs font-bold rounded-md transition-all ${
                activeTerminalTab === "sandbox"
                  ? "bg-emerald-600/10 border border-emerald-500/20 text-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              💻 Free Linux practice Sandbox
            </button>
          </div>

          {/* ACTIVE TERMINAL TAB PANEL VIEWPORT */}
          {activeTerminalTab === "mission" ? (
            <div className="saas-card rounded-xl overflow-hidden flex flex-col flex-1 border border-slate-800 bg-[#050811]">
              <div className="p-4 bg-[#0C1220]/60 text-[10px] font-bold text-slate-400 border-b border-slate-900/60 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Target Node: {currentMission.targetIP}</span>
              </div>

              {/* Terminal Logs */}
              <div className="p-5 font-mono text-xs md:text-sm space-y-3.5 text-slate-300 h-96 overflow-y-auto leading-relaxed">
                {terminalLogs.map((log, index) => {
                  let cls = "text-slate-300";
                  if (log.startsWith("guest@beba-labs:")) cls = "text-indigo-400 font-bold";
                  if (log.startsWith("✔") || log.startsWith("[✔]")) cls = "text-emerald-400 font-bold";
                  if (log.startsWith("❌") || log.startsWith("ERROR:")) cls = "text-rose-400 font-bold";
                  if (log.startsWith("[+]")) cls = "text-indigo-400";
                  if (log.startsWith("Available")) cls = "text-slate-500 italic";
                  if (log.startsWith("  ")) cls = "text-slate-400 pl-4";

                  return (
                    <div key={index} className={`${cls} whitespace-pre-wrap`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 text-indigo-400 px-5 py-4 border-t border-slate-900 bg-[#050811]">
                <span className="font-bold font-mono shrink-0">guest@beba-labs:~$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type target scan or exfiltrate commands... (help)"
                  className="flex-1 bg-transparent text-slate-200 outline-none border-none p-0 focus:ring-0 placeholder-slate-700 font-mono text-sm caret-indigo-400"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </form>
            </div>
          ) : (
            <div className="saas-card rounded-xl overflow-hidden flex flex-col flex-1 border border-slate-800 bg-[#050811]">
              <div className="p-4 bg-[#0C1220]/60 text-[10px] font-bold text-slate-400 border-b border-slate-900/60 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Practice Terminal: localhost-loopback</span>
              </div>

              {/* Sandbox Logs */}
              <div className="p-5 font-mono text-xs md:text-sm space-y-3.5 text-slate-300 h-96 overflow-y-auto leading-relaxed">
                {sandboxLogs.map((log, index) => {
                  let cls = "text-slate-300";
                  if (log.startsWith("sandbox@beba-cyberlabs:")) cls = "text-emerald-400 font-bold";
                  if (log.startsWith("drwx") || log.startsWith("-rw-")) cls = "text-slate-400 font-mono";
                  return (
                    <div key={index} className={`${cls} whitespace-pre-wrap`}>
                      {log}
                    </div>
                  );
                })}
                <div ref={sandboxEndRef} />
              </div>

              {/* Sandbox Input Form */}
              <form onSubmit={handleSandboxSubmit} className="flex items-center gap-2 text-emerald-400 px-5 py-4 border-t border-slate-900 bg-[#050811]">
                <span className="font-bold font-mono shrink-0">sandbox@beba-cyberlabs:~$</span>
                <input
                  type="text"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  placeholder="Type arbitrary commands... (e.g. ls -la, uname -a, python3)"
                  className="flex-1 bg-transparent text-slate-200 outline-none border-none p-0 focus:ring-0 placeholder-slate-700 font-mono text-sm caret-emerald-400"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
