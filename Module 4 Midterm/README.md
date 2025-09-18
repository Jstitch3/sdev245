# Secure Message App (Node.js)

A simple Node.js app that demonstrates **SHA-256 hashing** and **AES-256 encryption** to protect data.

---

## 🚀 Usage

Run the script:

```bash
node src/index.js
```

Enter a message when prompted. The program will:

1. Hash the input with SHA-256
2. Encrypt with AES-256-CBC
3. Decrypt back to plaintext
4. Verify integrity by comparing hashes

---

## 🔐 Security Principles

* **Confidentiality** → AES-256 keeps data secret.
* **Integrity** → SHA-256 ensures the message isn’t altered.
* **Availability** → The process reliably encrypts/decrypts when needed.

---

## 🎲 Entropy & Keys

* Keys and IVs are generated with `crypto.randomBytes`.
* High entropy ensures strong, unpredictable keys.