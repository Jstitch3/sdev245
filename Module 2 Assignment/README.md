# Encryption Demo (Node.js)

This project demonstrates both **symmetric** and **asymmetric** encryption in Node.js.

## 🔑 Methods Used
- **Symmetric:** AES-256-CBC  
  - Uses a random 256-bit key and a random 16-byte IV.  
  - Suitable for encrypting large amounts of data.  

- **Asymmetric:** RSA-2048 with OAEP padding (SHA-256)  
  - Encrypts small messages directly with the public key.  
  - Decrypted with the private key.  
  - Ciphertext size is fixed (256 bytes for RSA-2048).  

## ▶️ How to Run
1. Run the script:  
   ```bash
   node src/index.js
