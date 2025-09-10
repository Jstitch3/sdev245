# Crypto Demo App (Node.js)

This project demonstrates cryptographic operations in **Node.js**:

## Features
1. **SHA-256 Hashing**
   - Hash strings or files with SHA-256.
   - Example: `hashString('hello world')`

2. **Caesar Cipher (Substitution Cipher)**
   - Encrypt/decrypt text using a shift value.
   - Example:
     ```js
     caesarEncrypt('Hello', 3) // "Khoor"
     caesarDecrypt('Khoor', 3) // "Hello"
     ```

3. **Digital Signatures (RSA + SHA-256)**
   - Sign and verify messages using RSA keys.
   - Example:
     ```js
     const { message, signature, publicKey } = signMessage('secret')
     verifySignature(message, signature, publicKey)
     ```

```sh
node src/index.js
