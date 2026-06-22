# Day 2: Linux Power User & Docker Lab Setup

Welcome to Day 2! Today, we are moving from basic OS usage to "Power User" status and setting up your persistent hacking laboratory using Docker. This saves RAM while giving you the full power of Kali and Parrot OS.
Welcome to Day 2! Today, we are moving from basic OS usage to "Power User" status and setting up a persistent hacking laboratory using Docker. This saves RAM while giving you the full power of Kali and Parrot OS.

## 1. What You Need to Know: Linux Power User
To be effective in cybersecurity, the terminal must be your home. You don't just "use" the filesystem; you manipulate it.

### Key Concepts
- **The Filesystem Hierarchy:** Everything is a file. `/etc` for config, `/var/log` for evidence, `/tmp` for volatile scripts.
- **Permissions (The Octal Way):** `chmod 755` (rwxr-xr-x) vs `chmod 600` (rw-------). Security starts with the principle of least privilege.
- **Piping & Redirection:** `grep`, `awk`, `sed`, and `find`. Chaining commands is where the real power lies.
- **Persistence:** How to keep your tools and data across sessions.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Bash Mastery & Filesystems
Execute these in your Zorin OS terminal:
1. **Find all `.log` files in `/var/log`** modified in the last 24 hours and copy them to your `notes/` folder for this day.
2. **Create a "secret" file** and set permissions so *only you* can read and write to it (`chmod 600`).
3. **Chain commands:** List all running processes, find "python", and output the result to `src/processes.txt`.

### Task B: Persistent Docker Lab (The "Deep Work")
We will set up **Kali Linux** and **Parrot Security** containers. Since you have 8GB RAM, this is much more efficient than VirtualBox.

#### 1. Setup Kali Linux (Persistent)
We use a "Volume" to ensure your work doesn't disappear when the container stops.
```bash
# Create a volume for Kali data
docker volume create kali-data

# Pull and run Kali (rolling version)
docker run -it --name kali-lab -v kali-data:/root --workdir /root kalilinux/kali-rolling /bin/bash
```
*Inside Kali:*
```bash
apt update && apt install -y kali-linux-headless  # This installs the core tools (takes time)
```

#### 2. Setup Parrot Security (Persistent)
```bash
# Create a volume for Parrot data
docker volume create parrot-data

# Pull and run Parrot
docker run -it --name parrot-lab -v parrot-data:/home/parrot --workdir /home/parrot parrotsec/core /bin/bash
```

---

## 3. Hands-on Exercises (The 3rd Hour)

1. **Automation Script:** Write a simple bash script in `src/setup_lab.sh` that checks if the docker containers are running, and if not, starts them.
2. **Comparison:** Inside both containers, run `uname -a` and `cat /etc/os-release`. Note the differences in your `notes/comparison.md`.
3. **User Management:** Create a new user in your Kali container, give them sudo rights, and verify they can only access their own home directory.

---

## 💡 Pro-Tip
Use `CTRL+P` then `CTRL+Q` to detach from a running Docker container without stopping it. Use `docker attach kali-lab` to jump back in!
