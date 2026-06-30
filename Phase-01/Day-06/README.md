# Day 6: Basic Cryptography

Welcome to the core of security. Without Cryptography, there is no privacy on the internet. Today we learn how to hide data in plain sight.

## 1. What You Need to Know

### Symmetric Encryption (The "Shared Secret")
- You use the **same key** to encrypt and decrypt.
- **Analogy:** A locked chest where both you and your friend have an identical physical key.
- **Standard:** AES (Advanced Encryption Standard).
- **Pros:** Fast. **Cons:** How do you get the key to your friend securely?

### Asymmetric Encryption (The "Public/Private" Pair)
- You have two keys: a **Public Key** (everyone can see) and a **Private Key** (only you have).
- Data encrypted with the Public Key can *only* be decrypted by the Private Key.
- **Analogy:** A mailbox. Anyone can put mail in (Public), but only you have the key to take it out (Private).
- **Standard:** RSA, ECC (Elliptic Curve Cryptography).

---

## 2. Practical Tasks (60 - 90 Minutes)

### Task A: Symmetric Encryption with OpenSSL
We will use AES-256 to encrypt a secret message inside your Kali container.
1. **Create a secret:** `echo "My secret message" > secret.txt`
2. **Encrypt it:**
   ```bash
   openssl enc -aes-256-cbc -salt -in secret.txt -out secret.txt.enc
   ```
   (It will ask you for a password—this is your Symmetric Key).
3. **Try to read the encrypted file:** `cat secret.txt.enc`. It's gibberish.
4. **Decrypt it:**
   ```bash
   openssl enc -aes-256-cbc -d -in secret.txt.enc -out decrypted.txt
   ```

### Task B: Asymmetric Encryption with GPG
1. **Generate a key pair:** `gpg --full-generate-key` (Follow the prompts, use defaults).
2. **List your keys:** `gpg --list-keys`.
3. **Export your public key:** `gpg --export -a "Your Name" > my_public_key.asc`.

---

## 3. Hands-on Exercises (The 3rd Hour - Deep Work)

### Exercise 1: The "Hacker's" Decryptor
In `src/symmetric_tool.py`, write a Python script that uses the `cryptography` library to encrypt and decrypt a string.

### Exercise 2: Key Management Note
In `notes/key_security.md`, answer: If someone steals your **Private Key**, but doesn't have your **Public Key**, can they still read your messages? (Research "Asymmetric encryption flow").

### Exercise 3: Real World Application
Look at the URL bar of this GitHub page. Click the "Padlock" icon. Which type of encryption is being used? (Hint: Look for "Connection is secure" -> "Certificate is valid"). Record your findings in `notes/web_crypto.md`.

---

## 💡 Pro-Tip
Never hardcode encryption keys inside your source code. If an attacker gets your code, they get your keys. Use environment variables or Key Management Systems (KMS).
