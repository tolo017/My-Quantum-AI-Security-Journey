# Hashing & Signature Security

## Why Hashing?
Hashing ensures **Integrity**. If a file changes, the hash changes.

## The Signature Failure
- **What happened when you modified the signed file?**
> `It caused the signature to fail. There was a hash mismatch.`

## Vulnerable Hashes
Why are MD5 and SHA-1 no longer used for security? (Research "Hash Collisions").
> `They suffer from critical cryptographic flaws called hash collisions. This occurs when two completely different inputs generate the exact same hash output. This makes it easier for attackers to forge files and bypass security checks.`

---
### Screenshot: GPG Verification Failure
*(Upload screenshot of the 'BAD signature' message)*
