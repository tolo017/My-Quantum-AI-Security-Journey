#!/usr/bin/env python3
import sys
import subprocess
import shutil

def check_command(cmd):
    path = shutil.which(cmd)
    if path:
        try:
            version = subprocess.check_output([cmd, "--version"], stderr=subprocess.STDOUT).decode().strip()
            # Split to get the first line of version
            first_line = version.split('\n')[0]
            print(f"[+] {cmd.capitalize()}: Found at {path} ({first_line})")
            return True
        except Exception:
            print(f"[+] {cmd.capitalize()}: Found at {path} (Could not read version)")
            return True
    else:
        print(f"[-] {cmd.capitalize()}: NOT found in PATH")
        return False

def main():
    print("=" * 50)
    print("       BEBA BEBA LABS - ENVIRONMENT CHECKER       ")
    print("=" * 50)

    python_ok = True
    print(f"[+] Python: Found at {sys.executable} (Version {sys.version.split()[0]})")

    cargo_ok = check_command("cargo")
    docker_ok = check_command("docker")

    print("-" * 50)
    if python_ok and cargo_ok and docker_ok:
        print("[SUCCESS] Your hacker lab foundation is ready for action! 🚀")
    else:
        print("[WARNING] Some tools are missing. Please complete the installation.")
    print("=" * 50)

if __name__ == "__main__":
    main()
