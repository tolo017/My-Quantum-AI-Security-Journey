#!/bin/bash

TARGET=$1

if [ -z "$TARGET" ]; then
    echo "Usage: ./scanner.sh [IP_ADDRESS]"
    exit 1
fi

echo "--- STARTING SCAN ON $TARGET ---"

echo "[1] Running Quick Scan (Top 100 ports)..."
nmap -F $TARGET > scan_quick.txt

echo "[2] Running Service Version Scan (Deep)..."
nmap -sV -T4 $TARGET > scan_deep.txt

echo "✅ Scans complete. Results saved to scan_quick.txt and scan_deep.txt"
