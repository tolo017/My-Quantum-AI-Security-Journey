# Day 4: Networking Fundamentals II (Deep Dive)

Yesterday we saw how packets get to their destination. Today, we look at the content of those packets and how to secure (and break) the communication channels.

## 1. What You Need to Know

### HTTP vs. HTTPS
- **HTTP (Port 80):** Plain text. Anyone on the network (using Wireshark) can read your passwords, cookies, and data.
- **HTTPS (Port 443):** Encrypted using TLS. Wireshark will only see encrypted gibberish.

### SSH (Secure Shell - Port 22)
- The industry standard for remote management.
- Uses public-key cryptography to ensure you are talking to the right server and that the connection is encrypted.

### Wireshark & Tcpdump
- **Wireshark:** Visual tool to inspect every bit and byte of network traffic.
- **Tcpdump:** Command-line packet sniffer. Great for servers or quick checks.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Sniffing Plain Text (HTTP)
1. **On your Zorin Host:** Open Wireshark. Select your active interface.
2. **Filter:** Type `http` in the filter bar.
3. **In your browser:** Go to `http://neverssl.com` (a site that is purposefully not encrypted).
4. **In Wireshark:** Look at the packets. Find the "GET" request. Right-click it and select **Follow -> TCP Stream**. You can see the raw HTML code!

### Task B: The Red vs. Blue Lab (Kali vs. Parrot)
1. **Setup Parrot (The Server):**
   ```bash
   apt update && apt install -y openssh-server
   service ssh start
   ```
2. **Attack/Connect from Kali (The Client):**
   ```bash
   ssh root@[PARROT_IP_ADDRESS]
   ```
3. **Observation:** Try to sniff this SSH traffic in Wireshark on your host. You'll see the connection, but you won't be able to read any commands or passwords. This is the power of encryption.

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: PCAP Analysis
Download a sample "Man-in-the-Middle" pcap (I will provide a guide in the chat). Use Wireshark to find the stolen credentials. Note your findings in `notes/pcap_analysis.md`.

### Exercise 2: Python Traffic Monitor
In `src/traffic_monitor.py`, we will use the `scapy` library (you'll need to `pip install scapy`) to build a script that prints the Source IP and Destination IP of every packet it sees.

### Exercise 3: SSH Hardening
On your Parrot container, modify `/etc/ssh/sshd_config` to:
1. Change the port from 22 to 2222.
2. Disable root login (`PermitRootLogin no`).
3. Try to connect again from Kali. Note the changes needed in your `notes/ssh_hardening.md`.

---

## 💡 Pro-Tip
Never send passwords over a network you don't trust unless you see the "Padlock" (HTTPS) in your browser. Even then, "Man-in-the-Middle" attacks can sometimes strip that encryption (SSL Stripping).
