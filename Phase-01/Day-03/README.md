# Day 3: Networking Fundamentals I

Today we strip away the theory of the OSI model and look at how data actually moves through the wires (or air). If you can't understand the network, you can't defend it—or attack it.

## 1. What You Need to Know: The Practical OSI
Forget the textbook definitions. Think of it like this:
- **Layer 2 (Data Link):** MAC addresses. How your computer talks to your router.
- **Layer 3 (Network):** IP addresses. How your router talks to the world.
- **Layer 4 (Transport):** TCP/UDP. Is the data guaranteed to arrive (TCP) or is it a "fire and forget" stream (UDP)?
- **Layer 7 (Application):** HTTP, DNS, SSH. The stuff you actually interact with.

### Key Tools
- `ip a`: See your local network identity.
- `ping`: Check if a "heartbeat" exists between you and a target.
- `traceroute`: Map every router "hop" between you and a server.
- `dig`: Ask a DNS server exactly what it knows about a domain.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Local Identity & Connectivity
Run these in your Kali or Zorin terminal:
1. **Find your IP and MAC address:** `ip a`. Note which interface is your ethernet/wifi and which is the docker bridge.
2. **Path to Google:** Run `traceroute google.com`. How many "hops" (routers) does your data go through before reaching Google?
3. **Connectivity:** Use `ping -c 4 8.8.8.8` to check connection to Google's DNS.

### Task B: DNS Reconnaissance
DNS is the "Phonebook of the Internet." It’s also a goldmine for information.
1. **Basic Lookup:** `dig google.com`
2. **Find the Mail Server:** `dig google.com MX`
3. **Find the Name Servers:** `dig google.com NS`
4. **Reverse Lookup:** Take one of the IP addresses you found for Google and run `dig -x [IP_ADDRESS]`.

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

1. **Network Mapping:** Create a small diagram (or text list) in `notes/network_map.md` of your home network based on what you see in `ip a` and `ip route`. What is your Gateway IP?
2. **Python Automation:** In `src/check_dns.py`, write a small Python script that takes a domain name from the user and prints its IP address using the `socket` library.
   *Tip:* `import socket; socket.gethostbyname('example.com')`
3. **Analysis:** Why does `traceroute` sometimes show stars `* * *` for certain hops? Research and answer in `notes/analysis.md`.

---

## 💡 Pro-Tip
DNS records are often cached. If you make a change to a website and don't see it, your local DNS cache might be lying to you. Use `dig @8.8.8.8 [domain]` to ask Google's servers directly, bypassing your local cache!
