# Day 8: The Hacker's Methodology

To think like a hacker, you must follow the process. Hacking isn't just one magic command; it's a series of logical steps. Today, we break down the 4 core phases.

## 1. Reconnaissance (The "Research" Phase)
Before touching the target, you gather intel.
- **Passive Recon:** Googling, LinkedIn, `whois` lookups. The target doesn't know you're looking.
- **Active Recon:** `dig` or visiting the website. The target *might* log your IP.

## 2. Scanning (The "Map" Phase)
Now you look for doors and windows.
- **Port Scanning:** Using `nmap` to see what services are running (SSH, HTTP, etc.).
- **Vulnerability Scanning:** Looking for "known weak" versions of those services.

## 3. Exploitation (The "Entry" Phase)
You found an open window; now you climb through.
- This involves using an **Exploit** (the tool to get in) and a **Payload** (what you want to do once inside, like get a shell).

## 4. Post-Exploitation (The "Control" Phase)
You're in. Now what?
- **Persistence:** Ensuring you can get back in even if they restart the computer.
- **Privilege Escalation:** Moving from a "normal user" to "root/admin."
- **Cleanup:** Deleting logs so nobody knows you were there.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Recon Practice
1. Find the owner of a domain: `whois example.com`
2. Find the IP address: `dig +short example.com`

### Task B: Scanning Practice (The Lab)
From your Kali container, scan your Parrot container:
```bash
nmap -sV [PARROT_IP]
```
*(The `-sV` flag tells nmap to try and guess the version of the software).*

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: The Methodology Map
Create a text file `notes/target_profile.md`. Pick a fictional target and list exactly how you would perform each of the 4 phases.

### Exercise 2: Nmap Automation
In `src/scanner.sh`, write a bash script that takes an IP address as input and runs a "Quick Scan" vs a "Deep Scan."

### Exercise 3: Documentation
- Explain why "Reconnaissance" is often the longest phase (70% of the time) in `notes/recon_importance.md`.

---

## 💡 Pro-Tip
A good hacker is like a ghost. They spend most of their time watching and very little time "attacking." The more you know, the easier the exploit becomes.
