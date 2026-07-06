# Day 7: Hashing, Digital Signatures, & PKI

Yesterday we learned how to hide data. Today, we learn how to prove data hasn't been changed (**Integrity**) and prove who it came from (**Authenticity**).

## 1. What You Need to Know

### Hashing (The "Digital Fingerprint")
- A one-way function. You can turn a file into a hash, but you can't turn a hash back into the file.
- If even **one bit** of the file changes, the hash changes completely.
- **Standard:** SHA-256.

### Digital Signatures (The "Seal of Trust")
- Combines Hashing and Asymmetric encryption.
- You hash a file, then encrypt that hash with your **Private Key**.
- Anyone can decrypt the hash with your **Public Key** to verify it was really you who signed it.

### PKI (Public Key Infrastructure)
- How we trust who is who on the internet.
- **Certificate Authority (CA):** A trusted third party that "vouchers" for your identity by signing your public key.

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Hashing with `sha256sum`
1. **Create a file:** `echo "Trust but verify" > evidence.txt`
2. **Generate the hash:** `sha256sum evidence.txt`
3. **The "Hacker" change:** Edit the file and change one letter. Run `sha256sum` again. Notice how the hash is now totally different!

### Task B: GPG Digital Signatures
1. **Sign a file:**
   ```bash
   gpg --clearsign evidence.txt
   ```
   *(This creates `evidence.txt.asc` which contains your message and your signature).*
2. **Verify the signature:**
   ```bash
   gpg --verify evidence.txt.asc
   ```
   *(It should say "Good signature from...")*

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: Directory Integrity Checker
In `src/integrity_checker.py`, we will write a script that scans a folder and saves the SHA-256 hashes of every file to a JSON file.

### Exercise 2: Building a Private CA
We will use OpenSSL to create our own Root CA and sign a "Certificate Signing Request" (CSR). This is how you secure your own internal servers.

### Exercise 3: Documentation
- Record your CA commands in `notes/ca_setup.md`.
- Explain why "MD5" and "SHA-1" are no longer considered secure for hashing in `notes/hash_security.md`.

---

## 💡 Pro-Tip
When downloading security tools (like Kali ISOs), always check the provided SHA-256 hash against the file you downloaded. If they don't match, the file was corrupted or tampered with!
