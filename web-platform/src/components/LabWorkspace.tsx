"use client";

import { useState, useEffect, useRef } from "react";
import {
  Terminal, Shield, Globe, Lock, Unlock, Server, RefreshCw, CheckCircle2,
  AlertTriangle, Play, HelpCircle, ArrowLeft, Download, Wifi, WifiOff, FileText, Briefcase
} from "lucide-react";
import Link from "next/link";

// 10 Day Corporate / Freelance Target Environments
const LAB_MISSIONS = [
  {
    day: 1,
    title: "Orchestrate Local Range",
    client: "Beba Cyber Labs Intern Test",
    difficulty: "Beginner",
    objective: "Verify container orchestrations and ping the isolated database backend.",
    targetIP: "10.10.10.5",
    flag: "FLAG{BEBA_DOCKER_RANGE_SUCCESS}",
    instructions: [
      "Ensure your virtual VPN link is established.",
      "Probe the active local docker cluster configuration by running: docker ps",
      "Verify connection to target container using: ping -c 3 10.10.10.5",
      "Read the hidden target hash file using: cat /var/secrets/flag.txt"
    ],
    hint: "The command 'cat /var/secrets/flag.txt' on the remote host reveals the flag once the VPN is active."
  },
  {
    day: 2,
    title: "Linux SUID Privilege Audit",
    client: "Apex Financial Systems (Freelance Audit)",
    difficulty: "Beginner",
    objective: "Identify and exploit misconfigured SUID binaries to retrieve the administrative root key.",
    targetIP: "10.10.20.12",
    flag: "FLAG{LINUX_SUID_ROOT_SHELL}",
    instructions: [
      "Establish your VPN tunnel link.",
      "Access the remote Linux console using: ssh auditor@10.10.20.12",
      "Search for world-writable or SUID files using: find /usr/bin -perm -4000",
      "Trigger the vulnerable SUID helper utility to dump the root key: cat /root/root_flag.txt"
    ],
    hint: "Run 'find /usr/bin -perm -4000' inside your SSH session to locate the binary."
  },
  {
    day: 3,
    title: "DNS Subdomain Harvesting",
    client: "MedTech Global (Corporate Pentest)",
    difficulty: "Beginner",
    objective: "Exploit a misconfigured DNS server to dump the entire subdomain list via a Zone Transfer (AXFR).",
    targetIP: "10.10.30.5",
    flag: "FLAG{DNS_ZONE_TRANSFER_EXPOSED}",
    instructions: [
      "Connect the VPN gateway.",
      "Query domain nameservers for: medtech.local using: dig NS medtech.local",
      "Attempt an AXFR Zone Transfer query to dump the record table: dig axfr medtech.local"
    ],
    hint: "Use 'dig axfr medtech.local' on the terminal to request nameserver synchronization."
  },
  {
    day: 4,
    title: "SSH Port Forwarding SOCKS Tunnel",
    client: "Global Logistics Group",
    difficulty: "Beginner",
    objective: "Configure a secure SOCKS5 dynamic proxy link to bypass firewalls and scan internal services.",
    targetIP: "10.10.40.80",
    flag: "FLAG{SSH_TUNNEL_PROXY_BYPASS}",
    instructions: [
      "Verify VPN is online.",
      "Establish SOCKS5 dynamic forward on port 1080 using: ssh -D 1080 -N user@10.10.40.80",
      "Perform a curl command through the proxy interface to extract the flag: curl --socks5 localhost:1080 http://internal.logistics.local"
    ],
    hint: "Ensure SOCKS forwarding command uses 'ssh -D 1080 -N ...' to create the tunnel."
  },
  {
    day: 5,
    title: "Namespace breakout & docker isolate",
    client: "SaaS Dev Corp (Cloud Security)",
    difficulty: "Beginner",
    objective: "Audit container namespace privileges and verify absolute subnet isolation.",
    targetIP: "10.10.50.15",
    flag: "FLAG{DOCKER_ESCAPE_PRIVILEGES}",
    instructions: [
      "Establish active VPN connection.",
      "List Docker bridge networks: docker network ls",
      "Check container privileges to verify root namespace escaping: docker exec -it db_service cat /proc/self/status"
    ],
    hint: "Run the 'docker network ls' or privileged check commands to reveal sandbox escape flags."
  },
  {
    day: 6,
    title: "Cryptographic payload decoder",
    client: "SecureBank SA (Digital Forensics)",
    difficulty: "Beginner",
    objective: "Decrypt a captured confidential payload using AES-256-GCM authenticated cipher.",
    targetIP: "10.10.60.4",
    flag: "FLAG{AES_256_GCM_AUTHENTICATED}",
    instructions: [
      "Ensure VPN connection is established.",
      "Identify the encrypted backup directory: ls -la /backup",
      "Decrypt the backup payload using your Python script: python3 secure_backup.py /backup/vault.enc"
    ],
    hint: "Run 'python3 secure_backup.py /backup/vault.enc' to run the custom decryptor on the target."
  },
  {
    day: 7,
    title: "Forged Certificate signature",
    client: "TrustRoot Inc (PKI Audit)",
    difficulty: "Beginner",
    objective: "Verify PKI trust chains and signature validity for secure wildcard domains.",
    targetIP: "10.10.70.30",
    flag: "FLAG{PKI_ROOT_CERT_TRUST}",
    instructions: [
      "Establish VPN link.",
      "Inspect the remote SSL certificate signature using: openssl x509 -in /certs/server.crt -text",
      "Verify validity against custom Root CA: openssl verify -CAfile /certs/rootCA.pem /certs/server.crt"
    ],
    hint: "Use 'openssl verify -CAfile /certs/rootCA.pem /certs/server.crt' to trigger the certificate validator."
  },
  {
    day: 8,
    title: "Evasion Network Port scan",
    client: "defense Cloud Networks (Red Team)",
    difficulty: "Beginner",
    objective: "Execute stealthy TCP scanning to bypass passive IDS triggers.",
    targetIP: "10.10.80.1",
    flag: "FLAG{NMAP_SYN_STEALTH_SCAN}",
    instructions: [
      "Connect secure VPN range link.",
      "Execute stealth half-open SYN scan: sudo nmap -sS -p 80,443,22 10.10.80.1",
      "Examine network logs to inspect firewall events: cat /var/log/ids_events.log"
    ],
    hint: "Run 'sudo nmap -sS -p 80,443,22 10.10.80.1' to probe the stealth port thresholds."
  },
  {
    day: 9,
    title: "Blind SQLi database harvest",
    client: "E-Commerce Retailer (Vulnerability Assessment)",
    difficulty: "Beginner",
    objective: "Exploit Boolean-Based Blind SQL injection to exfiltrate database user passwords.",
    targetIP: "10.10.90.100",
    flag: "FLAG{BLIND_SQLI_TOKEN_EXFIL}",
    instructions: [
      "Ensure VPN tunnel is established.",
      "Launch your automated Python exploiter: python3 blind_sqli.py 10.10.90.100",
      "View extracted admin hashes: cat /tmp/extracted_db_hash.txt"
    ],
    hint: "Run 'python3 blind_sqli.py 10.10.90.100' to exfiltrate database contents."
  },
  {
    day: 10,
    title: "LFI Source code extraction",
    client: "Federal Core Portal (Gov Pentest)",
    difficulty: "Intermediate",
    objective: "Bypass file extension appending using PHP filter wrappers to read administrative configurations.",
    targetIP: "10.10.100.22",
    flag: "FLAG{PHP_WRAPPER_SOURCE_LEAK}",
    instructions: [
      "Verify VPN is connected.",
      "Execute directory traversal probe: curl 'http://10.10.100.22/view.php?page=../../../../etc/passwd'",
      "Apply base64 wrapper filter to leak core configuration: curl 'http://10.10.100.22/view.php?page=php://filter/convert.base64-encode/resource=config'"
    ],
    hint: "Use the php://filter wrapper with convert.base64-encode to bypass local php compilations."
  }
];

export default function LabWorkspace() {
  const [activeLab, setActiveLab] = useState(1);
  const [vpnConnected, setVpnConnected] = useState(false);
  const [vpnConnecting, setVpnConnecting] = useState(false);
  const [vpnLogs, setVpnLogs] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Beba Cyber Lab Console v2.1.0 • Initialized.",
    "Type 'help' to view available range exploration commands."
  ]);
  const [userFlag, setUserFlag] = useState("");
  const [labCompleted, setLabCompleted] = useState<number[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const vpnEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read completed labs from localStorage
    const saved = localStorage.getItem("beba_completed_labs");
    if (saved) {
      try {
        setLabCompleted(JSON.parse(saved));
      } catch (e) {
        setLabCompleted([]);
      }
    }
  }, []);

  // Auto Scroll Terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  // Auto Scroll VPN to bottom
  useEffect(() => {
    vpnEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [vpnLogs]);

  const currentMission = LAB_MISSIONS.find(m => m.day === activeLab) || LAB_MISSIONS[0];

  // VPN connection simulation
  const handleToggleVpn = () => {
    if (vpnConnected) {
      setVpnConnected(false);
      setVpnLogs(prev => [...prev, "[!] VPN Disconnected. Remote secure tunnels closed."]);
      return;
    }

    setVpnConnecting(true);
    setVpnLogs([
      "[*] Initializing OpenVPN link tunnel interface...",
      "[*] Parsing Client Config: bebalabs-secure-profile.ovpn",
      "[*] Resolving gateway address: gateway-us-east.bebalabs.local",
      "[*] Initiating TLS v1.3 cryptographic handshake..."
    ]);

    const steps = [
      "[*] Negotiating DH parameters: Elliptic Curve SECP256R1...",
      "[+] Cryptographic Session Keys agreed! Negotiated cipher: AES-256-GCM",
      "[*] Allocating local network interface: tun0",
      "[+] Local tunnel client IP assigned: 10.8.0.42",
      "[+] Establishing SOCKS5 pivot routing routes to 10.10.0.0/16...",
      "[✔] SUCCESS: VPN Tunnel Connected. Secure Cyber Range fully accessible!"
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setVpnLogs(prev => [...prev, step]);
        if (index === steps.length - 1) {
          setVpnConnecting(false);
          setVpnConnected(true);
        }
      }, (index + 1) * 600);
    });
  };

  // Command parser for range shell simulator
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const input = terminalInput.trim();
    const cmd = input.toLowerCase().split(" ")[0];
    const args = input.split(" ").slice(1);

    let response: string[] = [];
    response.push(`guest@beba-labs:~$ ${input}`);

    // If command is help or clear, they run regardless of VPN
    if (cmd === "help") {
      response.push(
        "Available commands:",
        "  help                           Display command lists",
        "  clear                          Flush terminal window",
        "  ping <ip>                      Ping local or remote hosts",
        "  nmap <options> <ip>            Scan network ports",
        "  ssh <user>@<ip>                Connect to remote terminals",
        "  dig <options> <domain>         Harvest domain DNS records",
        "  curl <url>                     Send HTTP requests",
        "  docker <options>               Query container cluster status",
        "  openssl <options>              Inspect cryptography certificates",
        "  cat <file>                     Read local files"
      );
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      setTerminalInput("");
      return;
    } else {
      // For all other commands, check if VPN is active
      if (!vpnConnected) {
        response.push(
          "❌ ERROR: Host unreachable.",
          "Ping timeout. Target subnet gateway is offline.",
          "👉 Hint: Connect to the Beba Security VPN range first in the left panel!"
        );
      } else {
        // State-aware simulator response depending on active lab
        switch (cmd) {
          case "ping":
            const pingIP = args[0] || "";
            if (pingIP === currentMission.targetIP) {
              response.push(
                `PING ${pingIP} (56 data bytes)`,
                `64 bytes from ${pingIP}: icmp_seq=1 ttl=64 time=4.22 ms`,
                `64 bytes from ${pingIP}: icmp_seq=2 ttl=64 time=4.31 ms`,
                `64 bytes from ${pingIP}: icmp_seq=3 ttl=64 time=3.95 ms`,
                `--- ${pingIP} ping statistics ---`,
                "3 packets transmitted, 3 received, 0% packet loss, time 2004ms"
              );
            } else {
              response.push(`ping: transmit failed. Host ${pingIP} is inactive.`);
            }
            break;

          case "docker":
            if (activeLab === 1) {
              response.push(
                "CONTAINER ID   IMAGE                 COMMAND                  STATUS         PORTS",
                "a19df2b8f882   vulhub/php:8.1        \"docker-php-entryp...\"   Up 2 hours     10.10.10.5:80->80/tcp",
                "f92d8329b38c   alpine:latest         \"sleep infinity\"         Up 2 hours     lab_attacker_sandbox"
              );
            } else if (activeLab === 5) {
              response.push(
                "NETWORK ID     NAME                  DRIVER    SCOPE",
                "d92b8a8df0b2   secure_cyber_range    bridge    local",
                "a19f82d029bc   backend_isolate       bridge    local"
              );
            } else {
              response.push("docker: cluster active. Use specific options corresponding to Active Lesson.");
            }
            break;

          case "ssh":
            const sshTarget = args[0] || "";
            if (activeLab === 2 && sshTarget === "auditor@10.10.20.12") {
              response.push(
                "[*] Connecting to ssh://auditor@10.10.20.12:22...",
                "[*] Host key verified: SHA256:d8a0f92b...",
                "auditor@10.10.20.12's password: (authorized via keypair publickey)",
                "Welcome to Apex Financial Audit Host Node 4 • Ubuntu 22.04 LTS",
                "auditor@apex-host:~$ "
              );
            } else {
              response.push(`ssh: connection refused by ${sshTarget}. Check configuration.`);
            }
            break;

          case "find":
            if (activeLab === 2) {
              response.push(
                "/usr/bin/passwd",
                "/usr/bin/chsh",
                "/usr/bin/gpasswd",
                "/usr/bin/audit_privileged_helper  <-- [!] Flag: SUID set (rws-r-x-r-x)"
              );
            } else {
              response.push("find: command completed.");
            }
            break;

          case "dig":
            const domain = args[args.length - 1] || "";
            if (activeLab === 3 && domain === "medtech.local") {
              if (input.includes("axfr")) {
                response.push(
                  "; <<>> DiG 9.18.1 <<>> axfr medtech.local",
                  ";; global options: +cmd",
                  "medtech.local.          86400   IN      SOA     ns1.medtech.local. admin.medtech.local. 2026072801 28800 7200 604800 86400",
                  "medtech.local.          86400   IN      NS      ns1.medtech.local.",
                  "ns1.medtech.local.      86400   IN      A       10.10.30.5",
                  "mail.medtech.local.     86400   IN      MX      10 mailserver.medtech.local.",
                  `vault-backup.medtech.local. 86400 IN   TXT     "FLAG=${currentMission.flag}"`,
                  "medtech.local.          86400   IN      SOA     ns1.medtech.local. admin.medtech.local. 2026072801 28800 7200 604800 86400",
                  ";; Query time: 12 msec",
                  ";; SERVER: 10.10.30.5#53(10.10.30.5) (TCP)",
                  ";; MSG SIZE  rcvd: 422"
                );
              } else if (input.includes("ns")) {
                response.push(
                  ";; ANSWER SECTION:",
                  "medtech.local.          86400   IN      NS      ns1.medtech.local."
                );
              } else {
                response.push("dig: Query completed. Hint: Try AXFR zone transfer option.");
              }
            } else {
              response.push("dig: server response: NXDOMAIN");
            }
            break;

          case "curl":
            const url = args[args.length - 1] || "";
            if (activeLab === 4 && url.includes("internal.logistics.local")) {
              if (input.includes("--socks5 localhost:1080")) {
                response.push(
                  "HTTP/1.1 200 OK",
                  "Server: Nginx/1.22",
                  "Content-Type: text/html",
                  "",
                  `<html><body><h1>Internal GLG Gateway</h1><p>Active Flag: <strong>${currentMission.flag}</strong></p></body></html>`
                );
              } else {
                response.push("curl: (56) Recv failure: Connection reset by firewall. Blocked internal subnet routing.");
              }
            } else if (activeLab === 10 && url.includes("10.10.100.22/view.php")) {
              if (url.includes("php://filter/convert.base64-encode/resource=config")) {
                response.push(
                  "HTTP/1.1 200 OK",
                  "Content-Length: 124",
                  "",
                  "PD9waHAKLy8gQ29yZSBjb25maWcKJGZsYWcgPSAiRkxBR3tQSFBfV1JBUFBFUl9TT1VSQ0VfTEVBS30iOwo/Pg=="
                );
              } else if (url.includes("../../../../etc/passwd")) {
                response.push(
                  "root:x:0:0:root:/root:/bin/bash",
                  "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
                  "bin:x:2:2:bin:/bin:/usr/sbin/nologin"
                );
              } else {
                response.push("HTTP/1.1 200 OK", "LFI endpoint loaded. Pass parameter 'page' to view files.");
              }
            } else {
              response.push(`curl: Connecting to ${url} timed out.`);
            }
            break;

          case "openssl":
            if (activeLab === 7) {
              response.push(
                "Certificate:",
                "    Data:",
                "        Version: 3 (0x2)",
                "        Serial Number: 279549 (0x443f1)",
                "        Signature Algorithm: sha256WithRSAEncryption",
                "        Issuer: C=US, O=BebaCyberLabs, CN=BebaRootCA",
                "        Subject: C=US, O=BebaCyberLabs, CN=intranet.bebalabs.local",
                "        Validity:",
                "            Not Before: Jul 28 00:00:00 2026 GMT",
                "            Not After : Jul 28 00:00:00 2027 GMT",
                `        Custom Extension: FLAG=${currentMission.flag}`,
                "openssl: Verification succeeded."
              );
            } else {
              response.push("openssl: use specific arguments matching Day 7 instructions.");
            }
            break;

          case "python3":
            const script = args[0] || "";
            if (activeLab === 6 && script === "secure_backup.py") {
              response.push(
                "[*] Executing secure AES backup decoder script...",
                "[*] Reading input ciphertext: /backup/vault.enc",
                "[*] Found Salt: f9a0d82bf...",
                "[*] Key derivation iterations complete.",
                "[+] Authentication Tag secure! Access granted.",
                `[✔] DECRYPTED PAYLOAD: ${currentMission.flag}`
              );
            } else if (activeLab === 9 && script === "blind_sqli.py") {
              response.push(
                "[*] Scanning index parameter on 10.10.90.100...",
                "[+] Character position 1 matches: F",
                "[+] Character position 2 matches: L",
                "[+] Character position 3 matches: A",
                "[+] Character position 4 matches: G",
                `[*] Extracted SQL Table Flag: ${currentMission.flag}`
              );
            } else {
              response.push("python3: executed script file.");
            }
            break;

          case "cat":
            const catFile = args[0] || "";
            if (activeLab === 1 && catFile === "/var/secrets/flag.txt") {
              response.push(
                "Accessing root filesystem namespace...",
                "Reading secret storage nodes...",
                `Flag Content: ${currentMission.flag}`
              );
            } else {
              response.push(`cat: ${catFile}: No such file or directory.`);
            }
            break;

          default:
            response.push(`bash: ${cmd}: command not found. Try 'help' for support.`);
            break;
        }
      }
    }

    setTerminalLogs(prev => [...prev, ...response]);
    setTerminalInput("");
  };

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFlag.trim()) return;

    if (userFlag.trim() === currentMission.flag) {
      // Add to completed array if not already present
      const updated = [...labCompleted];
      if (!updated.includes(activeLab)) {
        updated.push(activeLab);
        setLabCompleted(updated);
        localStorage.setItem("beba_completed_labs", JSON.stringify(updated));
      }
      setShowNotification(true);
      setUserFlag("");
      setTimeout(() => setShowNotification(false), 5000);
    } else {
      alert("❌ INCORRECT FLAG. Check your commands, gather findings, and try again!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Upper Navigation Header */}
      <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-5">
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
              <span>Beba Security Virtual Ranges</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Multi-Subnet Penetration Testing Range & VPN Labs</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-bold">Labs Completed:</span>
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-bold px-3 py-1.5 rounded-lg">
            {labCompleted.length} / 10 Active
          </span>
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

          {/* VPN Connection Widget Controller */}
          <div className="saas-card p-5 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-400" />
                <span>Secure VPN Connection</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${vpnConnected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
                <span className="text-[10px] font-mono font-bold uppercase text-slate-300">
                  {vpnConnected ? "LINK SECURE" : "DISCONNECTED"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              You must download the OpenVPN range credentials and click connect to establish secure SOCKS5 pivot routes to target subnets.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert("Mock Config Profile 'bebalabs-secure-profile.ovpn' downloaded to your home range!")}
                className="flex items-center justify-center gap-1.5 border border-slate-800 hover:border-slate-600 bg-slate-900/40 p-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Config (.ovpn)</span>
              </button>
              <button
                onClick={handleToggleVpn}
                disabled={vpnConnecting}
                className={`w-full text-xs font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  vpnConnected
                    ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10"
                }`}
              >
                {vpnConnecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>TUNNELING...</span>
                  </>
                ) : vpnConnected ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>DISCONNECT VPN</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>CONNECT VPN</span>
                  </>
                )}
              </button>
            </div>

            {/* VPN Real-Time Console Logging */}
            <div className="h-28 bg-[#050811] rounded-lg border border-slate-900 p-3 font-mono text-[10px] text-slate-400 overflow-y-auto space-y-1">
              {vpnLogs.length === 0 ? (
                <span className="italic text-slate-600">VPN Client daemon idle. Click connect tunnel.</span>
              ) : (
                vpnLogs.map((log, index) => {
                  let cls = "text-slate-400";
                  if (log.startsWith("[✔]")) cls = "text-emerald-400 font-bold";
                  if (log.startsWith("[+]")) cls = "text-indigo-400";
                  return <div key={index} className={cls}>{log}</div>;
                })
              )}
              <div ref={vpnEndRef} />
            </div>
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
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Guided Execution Steps:</span>
                <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                  {currentMission.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

        </div>

        {/* Right Hand Live Hacker Console & Flag Verification (Col span 7) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col h-full">

          {/* Active Lab Terminal Panel */}
          <div className="saas-card rounded-xl overflow-hidden flex flex-col flex-1 border border-slate-800">
            {/* Terminal Window Header Bar */}
            <div className="bg-[#0C1220] px-4 py-3 flex items-center justify-between border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400 ml-2 tracking-tight flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>guest@beba-labs: /ranges/day-{activeLab} (SOCKS tunnel)</span>
                </span>
              </div>

              <button
                onClick={() => setTerminalLogs(["Beba Cyber Lab Console v2.1.0 • Flushed."])}
                title="Flush Screen"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terminal Console Viewport Screen */}
            <div className="p-5 font-mono text-xs md:text-sm space-y-3.5 text-slate-300 h-96 bg-[#050811] overflow-y-auto leading-relaxed">
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

            {/* Terminal Input Form bar */}
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 text-indigo-400 bg-[#050811] px-5 py-4 border-t border-slate-900">
              <span className="font-bold font-mono shrink-0">guest@beba-labs:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command... (e.g. nmap, curl, ssh, help)"
                className="flex-1 bg-transparent text-slate-200 outline-none border-none p-0 focus:ring-0 placeholder-slate-700 font-mono text-sm caret-indigo-400"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
            </form>
          </div>

          {/* Flag Submission & Check Node */}
          <div className="saas-card p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Corporate System Flag Certification</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Obtained the security token? Input it below to lock in your freelance reputation credentials and earn portfolio merits.
            </p>

            <form onSubmit={handleFlagSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={userFlag}
                onChange={(e) => setUserFlag(e.target.value)}
                placeholder="FLAG{xxxxxxxxxxxxxxxxxx}"
                className="flex-1 bg-[#070B13] border border-slate-800 rounded-md p-3 text-slate-200 text-sm outline-none focus:border-indigo-500 font-mono transition-all"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-all whitespace-nowrap shadow-md shadow-indigo-600/15"
              >
                Submit flag
              </button>
            </form>

            {/* Success celebrate Alert Banner */}
            {showNotification && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg animate-pulse">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div className="text-xs">
                  <strong className="block font-bold">MISSION ACCOMPLISHED!</strong>
                  <span>Your profile portfolio credentials has been validated! Lab and secure flags is logged. Proceed to the next milestone.</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
