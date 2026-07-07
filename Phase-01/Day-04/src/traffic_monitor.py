from scapy.all import sniff, IP

def process_packet(packet):
    # We only care about IP packets
    if packet.haslayer(IP):
        src_ip = packet[IP].src
        dst_ip = packet[IP].dst
        print(f"📡 [PACKET] {src_ip} ----> {dst_ip}")

print("🚀 Starting Traffic Monitor... (Press Ctrl+C to stop)")
# count=0 means sniff forever, store=0 means don't keep packets in RAM
sniff(prn=process_packet, store=0)
