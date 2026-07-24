# Day 1: Environment Setup

Welcome to Day 1 of your 72-Day Cybersecurity: Quantum & Generative AI Roadmap! Today is all about building your base of operations. A hacker is only as good as their lab.

## 1. What You Need to Know: Your Arsenal
To tackle advanced AI attacks, quantum-safe algorithms, and hybrid exploits, you need a robust, isolated, and highly performant workstation.

### Operating System: Zorin OS
- **Why?** Built on Ubuntu, Zorin OS is extremely stable, lightweight, and user-friendly. It handles Docker volumes and systems development perfectly while keeping memory overhead minimal.

### Languages: Python & Rust
- **Python:** The undisputed king of AI, scripting, and automation. We'll use it for Scapy packet crafting, LLM interaction, and quantum simulations (Qiskit).
- **Rust:** The future of systems security. With its compile-time memory safety, Rust prevents 70% of vulnerabilities (like buffer overflows) before they ever run. We will build high-speed tooling with it.

### Virtualization: Docker
- **Why?** Traditional virtual machines (VirtualBox/VMware) consume massive amounts of CPU and RAM. On an 8GB RAM host, running multiple VMs is slow. Docker allows us to run isolated containers (Kali and Parrot OS) sharing the host's kernel with near-zero overhead.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Zorin OS & System Updates
Open your terminal on Zorin OS and run:
```bash
sudo apt update && sudo apt upgrade -y
```

### Task B: Installing Developer Tooling
Install Python, Rust, and Docker on your host machine:

1. **Python 3 & Pip:**
   ```bash
   sudo apt install -y python3 python3-pip python3-venv
   ```

2. **Rust Compiler (rustup):**
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   rustc --version
   ```

3. **Docker Engine:**
   ```bash
   sudo apt install -y docker.io
   sudo systemctl enable --now docker
   sudo usermod -aG docker $USER
   ```
   *Note: Log out and log back in for user group changes to take effect.*

---

## 3. Hands-on Exercises (The 3rd Hour)

1. **Verify Your Environment:** Run a test to ensure your developer components are active.
   - Run `python3 --version`
   - Run `cargo --version`
   - Run `docker --version`
2. **First Docker Run:** Pull and execute a lightweight, secure container to verify Docker:
   ```bash
   docker run --rm hello-world
   ```
3. **Note Your Versions:** Inside `notes/versions.md`, document the exact compiler and engine versions of Python, Cargo, and Docker installed on your host.

---

## 💡 Pro-Tip
Never run arbitrary scripts downloaded from the internet with `sudo` or root privileges directly. Always inspect the content of installer scripts (like the Rust installer) before running them!
