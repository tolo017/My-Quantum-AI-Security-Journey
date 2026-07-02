# Resource Limiting in Docker

## Why limit?
To prevent a "Denial of Service" (DoS) on your own host machine. If a container starts an infinite loop or consumes all RAM, the host OS could freeze.

## Implementation (Docker Compose)
Using the `deploy` key, we set:
- **Memory Limit:** 2G (Prevents RAM exhaustion)
- **CPU Limit:** 1.5 (Prevents 100% CPU usage)

## Verification Command
Run `docker stats` while your containers are running to see their real-time resource usage!

### Exercise Log
1. **Command used to start the lab:** `docker compose up -d`
2. **Observed Memory Limit in `docker stats`:** `2G`
3. **Did the Zorin Host stay responsive?** `Yes`

### Screenshot: Network Isolation Test
Upload your screenshot showing a ping between the networks.
