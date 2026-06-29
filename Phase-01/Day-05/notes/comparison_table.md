# Hypervisor Comparison

| Feature | Type-1 (Proxmox) | Type-2 (VirtualBox) | Containers (Docker) |
|---------|------------------|---------------------|---------------------|
| **OS** | Runs on Hardware | Runs on Host OS | Shares Host Kernel |
| **RAM Usage** | Low Overhead | High | Very Low |
| **Speed** | Fast | Slow | Near Native |
| **Isolation** | Strongest | Strong | Process-level |
| **Best For** | Servers/Cloud | Desktop Testing | Microservices/Labs |
