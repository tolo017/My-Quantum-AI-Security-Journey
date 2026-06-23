# Traceroute Analysis: The "Stars" Mystery

## Why do I see `* * *`?
When running `traceroute`, the stars represent a "Request Timed Out". This happens because:
1. **ICMP Filtering:** The router at that hop is configured to ignore or drop ICMP Time Exceeded packets to hide its identity.
2. **Rate Limiting:** The router might be too busy and deprioritizes traceroute requests.
3. **Packet Loss:** Actual network congestion.

## Target Comparisons
### **Google.com:**
   `traceroute google.com`
traceroute to google.com (142.251.47.46), 30 hops max, 60 byte packets
- 1  dev.opt (192.168.100.1)  17.111 ms  21.463 ms  28.437 ms
- 2  100.65.0.1 (100.65.0.1)  29.654 ms  31.153 ms  33.866 ms
- 3  10.70.55.1 (10.70.55.1)  35.256 ms  36.576 ms 10.70.55.5 (10.70.55.5)  37.908 ms
- 4  * * *
- 5  10.70.55.41 (10.70.55.41)  66.845 ms *  69.338 ms
- 6  10.70.86.77 (10.70.86.77)  74.362 ms  19.763 ms  21.886 ms
- 7  196.201.221.91 (196.201.221.91)  18.882 ms  20.258 ms

### **Microsoft.com:**
   `traceroute microsoft.com`
traceroute to microsoft.com (150.171.109.1), 30 hops max, 60 byte packets
- 1  dev.opt (192.168.100.1)  9.076 ms  10.719 ms  12.406 ms
- 2  100.65.0.1 (100.65.0.1)  15.352 ms  16.660 ms  23.483 ms
- 3  10.70.55.1 (10.70.55.1)  24.780 ms 10.70.55.5 (10.70.55.5)  26.044 ms 10.70.55.1 (10.70.55.1)  27.405 ms
- 4  * * *
- 5  * * *
- 6  10.70.55.41 (10.70.55.41)  28.683 ms 10.70.86.77 (10.70.86.77)  21.624 ms


### **Internal Gateway:**
   `ip a`
- 192.168.100.1
