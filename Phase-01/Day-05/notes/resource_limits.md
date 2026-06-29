# Resource Limiting in Docker

## Why limit?
To prevent a "Denial of Service" (DoS) on your own host machine. If a container starts an infinite loop or consumes all RAM, the host OS (Zorin) could freeze.

## Implementation (Docker Compose)
Using the `deploy` key, we set:
- **Memory Limit:** 1G (Prevents RAM exhaustion)
- **CPU Limit:** 0.5 (Prevents 100% CPU usage)

## Verification Command
Run `docker stats` while your containers are running to see their real-time resource usage!
