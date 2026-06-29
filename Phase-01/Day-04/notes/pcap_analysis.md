# PCAP Analysis: Telnet Investigation

## Incident Summary
- **Source File:** telnet-cooked.pcap
- **Protocol:** Telnet (Unencrypted)

## Findings
- **Username Found:** fake
- **Password Found:** user
- **Commands Executed:** ls, ls -a

## Reflection
Why is Telnet no longer used in modern secure environments?
- Telnet is as unsecure as http. It exposes user inputs and credentials. Telnet is unencrypted.
