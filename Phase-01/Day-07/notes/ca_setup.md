# Private CA Setup Log

## The Root CA
1. **Key Generation:** `openssl genrsa -out MyRootCA.key 4096`
2. **Self-Signed Cert:** `openssl req -x509 -new -nodes -key MyRootCA.key -sha256 -days 3650 -out MyRootCA.pem`

## Signing a Certificate
1. **The Request (CSR):** parrot.csr
2. **The Signature Command:**
> `openssl x509 -req -in parrot.csr -CA MyRootCA.pem -CAkey MyRootCA.key -CAcreateserial -out parrot.crt -days 500 -sha256`

## Reflection
Why is it dangerous if someone steals your `MyRootCA.key`?
> `It grants them complete control over your trusted network. It creates unrestricted impersonation, malicious code signing, Man-in-the-Middle attacks, and total loss of trust.`

---
### Screenshot: The Final parrot.crt
*(Upload screenshot showing the details of your newly created certificate)*
