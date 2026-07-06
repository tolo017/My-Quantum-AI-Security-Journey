# Key Security: Asymmetric Logic

## Scenario
If an attacker steals your **Private Key**, but you still have your **Public Key**...

### 1. Can the attacker read messages sent to you?
<<<<<<< roadmap-init-day-2-15693630423279156741
> [Your Answer Here]

### 2. Can the attacker impersonate you (Sign messages as you)?
> [Your Answer Here]

### 3. If you lose your Private Key (it's deleted), can you ever read your old encrypted messages again?
> [Your Answer Here]

---
### Screenshot: GPG Key List
*(Upload screenshot of your `gpg --list-keys` command here)*
![GPG Keys Placeholder]()
=======
> `Yes. They can read any messages encrypted with your Public Key. The Private Key is the only mathematical tool capable of decrypting data locked by the corresponding Public Key.`

### 2. Can the attacker impersonate you (Sign messages as you)?
> `Yes. The attacker can impersonate you perfectly. He is able to create digital signatures.`

### 3. If you lose your Private Key (it's deleted), can you ever read your old encrypted messages again?
> `No, youcannot read them. Those old messages are lost forever. Decryption is impossible.`

---
### Screenshot: GPG Key List
*(Upload screenshot of your `gpg --list-keys` command)*
>>>>>>> main
