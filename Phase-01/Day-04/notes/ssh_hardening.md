# SSH Hardening: Blue Team Report

## Changes Implemented
1. **Custom Port:** Moved from 22 to 2222.
   - *Result:* Automated bots scanning port 22 will no longer find the service.
2. **Disabled Root Login:** `PermitRootLogin no`.
   - *Result:* An attacker must now guess both a valid username AND a password, instead of just the password for 'root'.
3. **Reduced Max Retries:** Set to 3.
   - *Result:* Brute-force attacks are slowed down significantly.

## Testing
- **Old Connection Method:** [Result: Failed/Connection Refused]
- **New Connection Method:** `ssh -p 2222 [user]@[ip]`
- **Status:** Secured ✅
