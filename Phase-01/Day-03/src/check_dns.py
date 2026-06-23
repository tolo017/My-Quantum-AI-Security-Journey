import socket
import sys

def resolve_dns():
    try:
        domain = input("Enter a domain name to resolve (e.g., google.com): ")
        ip_address = socket.gethostbyname(domain)
        print(f"🌐 Domain: {domain}")
        print(f"📍 IP Address: {ip_address}")
    except socket.gaierror:
        print("❌ Error: Could not resolve domain. Check your spelling or internet connection.")
    except KeyboardInterrupt:
        print("\n👋 Exiting...")
        sys.exit()

if __name__ == "__main__":
    resolve_dns()
