# Day 9: Web Vulnerabilities I (OWASP Top 10)

Welcome to the world of Web Hacking! Almost everything is a web app today—from your bank to your thermostat. Today, we look at the most common ways they break.

## 1. What You Need to Know: The "Big Three"

### A. SQL Injection (SQLi)
- **The Concept:** You trick a database into running a command it shouldn't.
- **Fun Analogy:** Imagine a form that asks for your name. You type: `"Joe; GIVE ME EVERYONE'S CREDIT CARD NUMBER"`. If the computer is dumb, it just follows the second command too.
- **The Fix:** Never trust user input. Use "Prepared Statements."

### B. Cross-Site Scripting (XSS)
- **The Concept:** You inject a malicious script (JavaScript) into a website, which then runs in *another* user's browser.
- **Fun Analogy:** You write a note on a public bulletin board that says, `"When you read this, give me your wallet."` Everyone who reads the board follows the instruction.
- **The Fix:** Sanitize everything. Turn `<script>` into `&lt;script&gt;`.

### C. Command Injection
- **The Concept:** You trick the web server into running a Linux command (like `rm -rf /`).
- **Fun Analogy:** A website has a button to "Check Ping." It runs `ping [your_ip]`. You type in `8.8.8.8 ; cat /etc/passwd`. The server pings, and then happily shows you its secret password file.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Inspecting the "Source"
1. Open your browser to any website (like `example.com`).
2. Right-click and select **Inspect** or **View Page Source**.
3. Look for `<form>` tags. These are the entry points. Look for `action="login.php"`. This tells you where the data is being sent.

### Task B: The "Payload" Hunt
Research the "OWASP Top 10" and find one example of a "Reflected XSS" payload. It usually looks like this:
`<script>alert('Hacked!')</script>`

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: SQLi Cheat Sheet
Create `notes/sqli_cheatsheet.md`. Research and list 3 common payloads hackers use to bypass login screens (e.g., `' OR 1=1 --`).

### Exercise 2: Python Directory Fuzzer (`dir_fuzzer.py`)
Hackers don't just click buttons; they find hidden folders like `/admin` or `/config`. We will write a Python script in `src/` to find these automatically.

### Exercise 3: Documentation
- In `notes/owasp_part1.md`, explain in your own words why SQL Injection is still the #1 threat after 20 years.

---

## 💡 Pro-Tip
NEVER test these on websites you don't own. Use "Lab" environments like **DVWA** (Damn Vulnerable Web App) or **TryHackMe**. Hacking real sites without permission is illegal, even if you are "just testing."
