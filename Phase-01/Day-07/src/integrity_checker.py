import hashlib
import os
import json

def get_file_hash(filepath):
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        # Read file in chunks to handle large files
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def scan_directory(directory):
    results = {}
    for root, dirs, files in os.walk(directory):
        for file in files:
            path = os.path.join(root, file)
            results[path] = get_file_hash(path)
    return results

if __name__ == "__main__":
    dir_to_scan = input("Enter directory to baseline (e.g., .): ")
    print(f"🔍 Scanning {dir_to_scan}...")

    baseline = scan_directory(dir_to_scan)

    with open("baseline.json", "w") as f:
        json.dump(baseline, f, indent=4)

    print("✅ Baseline saved to baseline.json")
