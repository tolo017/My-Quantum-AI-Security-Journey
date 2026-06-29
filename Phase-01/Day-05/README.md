# Day 5: Virtualization & Lab Isolation

Today, we master the art of "Lab Isolation." In cybersecurity, we often handle dangerous code or perform tests that could break a system. We use Virtualization and Containerization to create a "Sandbox"—a playground where we can break things without hurting our main computer (the Host).

## 1. What You Need to Know

### Hypervisors vs. Containers
- **Type-1 Hypervisor (Bare Metal):** Runs directly on hardware (e.g., Proxmox, ESXi). High performance, used in data centers.
- **Type-2 Hypervisor (Hosted):** Runs as an app on your OS (e.g., VirtualBox, VMware). Good for desktop testing but eats a lot of RAM.
- **Containers (Docker):** Shares the Host's Kernel. Extremely lightweight (perfect for your 8GB RAM). It's not a full OS, but it feels like one.

### Lab Isolation
Isolation means that if a virus runs inside your Kali container, it cannot:
1. See your Zorin OS files.
2. Access your home Wi-Fi network.
3. Eat all your RAM and crash your computer.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: The Isolated Network
By default, Docker containers can talk to the internet. We want to create a "DMZ" (Demilitarized Zone)—a private network just for our lab.
```bash
# Create a private network called 'hacking-lab'
docker network create --driver bridge hacking-lab
```

### Task B: Docker Compose (The Lab Orchestrator)
Instead of starting containers one by one, we use a single file to define our entire world. I've created a `docker-compose.yml` for you in the `src/` folder.

To start your entire lab:
```bash
cd Phase-01/Day-05/src
docker-compose up -d
```

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: Resource Limiting
We don't want a "fork bomb" or heavy script to freeze your Zorin host. We will modify the `docker-compose.yml` to limit each container to **1GB of RAM** and **0.5 CPU**.
*Check your `notes/resource_limits.md` for the instructions.*

### Exercise 2: Network Segmentation
1. Connect Kali to `hacking-lab`.
2. Connect Parrot to a *different* network (or keep it on default).
3. Try to `ping` one from the other. It should fail. This is **Segmentation**—blocking lateral movement.

### Exercise 3: Hypervisor Comparison Table
In `notes/comparison_table.md`, fill out the differences you've learned today between VM vs. Container.

---

## 💡 Pro-Tip
Always use `--rm` when running temporary Docker containers. It automatically cleans up the container's filesystem when you exit, keeping your 8GB RAM and Disk Space clean!
