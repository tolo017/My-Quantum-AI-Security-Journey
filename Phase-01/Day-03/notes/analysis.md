# Traceroute Analysis: The "Stars" Mystery

## Why do I see `* * *`?
When running `traceroute`, the stars represent a "Request Timed Out". This happens because:
1. **ICMP Filtering:** The router at that hop is configured to ignore or drop ICMP Time Exceeded packets to hide its identity.
2. **Rate Limiting:** The router might be too busy and deprioritizes traceroute requests.
3. **Packet Loss:** Actual network congestion.

## Target Comparisons
- **Google.com:** [Note findings here]
- **Microsoft.com:** [Note findings here]
- **Internal Gateway:** [Does your local router show up or hide?]
