# Private CA Setup Log

## The Root CA
1. **Key Generation:** `openssl genrsa -out MyRootCA.key 4096`
2. **Self-Signed Cert:** `openssl req -x509 -new -nodes -key MyRootCA.key -sha256 -days 3650 -out MyRootCA.pem`

## Signing a Certificate
1. **The Request (CSR):** parrot.csr
2. **The Signature Command:**
> [Paste the command you used here]

## Reflection
Why is it dangerous if someone steals your `MyRootCA.key`?
> [Your Answer Here]

---
### Screenshot: The Final parrot.crt
*(Upload screenshot showing the details of your newly created certificate)*
![parrot.crt Placeholder]()
