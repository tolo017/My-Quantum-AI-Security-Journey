from cryptography.fernet import Fernet

def run_crypto_tool():
    # 1. Generate a Key
    key = Fernet.generate_key()
    cipher_suite = Fernet(key)
    print(f"🔑 Generated Key (SAVE THIS): {key.decode()}")

    # 2. Encrypt a message
    message = input("\nEnter a secret message to encrypt: ").encode()
    cipher_text = cipher_suite.encrypt(message)
    print(f"🔒 Encrypted: {cipher_text.decode()}")

    # 3. Decrypt it back
    print("\n--- Decrypting now... ---")
    plain_text = cipher_suite.decrypt(cipher_text)
    print(f"🔓 Decrypted Message: {plain_text.decode()}")

if __name__ == "__main__":
    run_crypto_tool()
