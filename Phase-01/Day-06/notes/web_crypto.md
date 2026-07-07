# Web Crypto Analysis: GitHub Certificate

## Certificate Inspection

=======
1. **Issuer:** `Sectigo`
2. **Key Exchange Algorithm:** `Elliptic Curve Public Key`
3. **Symmetric Encryption Used:** `SHA-256`

## Findings
Why do websites use Asymmetric encryption to *start* the connection but Symmetric encryption to *send* the data?
> `They mix both encryptions because Asymmetric encryption is too slow for moving heavy data and Symmetric encryption lacks a secure way to share password keys. This combination offers security and speed. They use it during TLS.`

---
### Screenshot: Browser Padlock Details
*(Upload screenshot of your browser's security certificate details)*
