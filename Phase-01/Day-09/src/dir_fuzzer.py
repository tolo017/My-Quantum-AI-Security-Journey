import requests
import sys

def fuzz(url, wordlist_path):
    print(f"🚀 Fuzzing {url}...")

    try:
        with open(wordlist_path, 'r') as f:
            for line in f:
                word = line.strip()
                test_url = f"{url}/{word}"

                try:
                    # We use a timeout so it doesn't hang
                    response = requests.get(test_url, timeout=2)

                    # 200 = Success, 403 = Forbidden (it exists!), 301 = Redirect
                    if response.status_code in [200, 403, 301]:
                        print(f"✅ FOUND: {test_url} (Status: {response.status_code})")
                except requests.exceptions.RequestException:
                    continue
    except FileNotFoundError:
        print(f"❌ Error: Wordlist file '{wordlist_path}' not found.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 dir_fuzzer.py [URL] [WORDLIST]")
        print("Example: python3 dir_fuzzer.py http://example.com wordlist.txt")
        sys.exit()

    target_url = sys.argv[1].rstrip('/')
    fuzz(target_url, sys.argv[2])
