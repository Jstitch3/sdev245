import { constants, createCipheriv, createDecipheriv, generateKeyPairSync, privateDecrypt, publicEncrypt, randomBytes } from 'node:crypto'

/* -------------------------------
   SYMMETRIC ENCRYPTION (AES-256-CBC)
-------------------------------- */
const symmetricKey = randomBytes(32) // 256-bit key
const iv = randomBytes(16)

function aesEncrypt(plaintext) {
  const cipher = createCipheriv("aes-256-cbc", symmetricKey, iv)
  let encrypted = cipher.update(plaintext, "utf8", "hex")
  encrypted += cipher.final("hex")
  return encrypted
}

function aesDecrypt(ciphertext) {
  const decipher = createDecipheriv("aes-256-cbc", symmetricKey, iv)
  let decrypted = decipher.update(ciphertext, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

const aesMessage = "This is a secret message using AES symmetric encryption!"
const aesEncrypted = aesEncrypt(aesMessage)
const aesDecrypted = aesDecrypt(aesEncrypted)

/* -------------------------------
   ASYMMETRIC ENCRYPTION (RSA-2048, OAEP)
-------------------------------- */
const { publicKey, privateKey } = generateKeyPairSync("rsa", {modulusLength: 2048})

const rsaMessage = "Hello RSA! This short text is encrypted with RSA-2048."

const rsaEncrypted = publicEncrypt({
    key: publicKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
}, Buffer.from(rsaMessage)).toString("base64")

const rsaDecrypted = privateDecrypt({
    key: privateKey,
    padding: constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
}, Buffer.from(rsaEncrypted, "base64")).toString("utf8")

/* -------------------------------
   OUTPUT
-------------------------------- */
console.log("=== SYMMETRIC (AES-256-CBC) ===")
console.log("Key (hex):", symmetricKey.toString("hex"))
console.log("IV (hex):", iv.toString("hex"))
console.log("Input:", aesMessage)
console.log("Encrypted:", aesEncrypted)
console.log("Decrypted:", aesDecrypted)

console.log("\n=== ASYMMETRIC (RSA-2048, OAEP) ===")
console.log("Public Key:\n", publicKey.export({ type: "pkcs1", format: "pem" }))
console.log("Private Key:\n", privateKey.export({ type: "pkcs1", format: "pem" }))
console.log("Input:", rsaMessage)
console.log("Encrypted (Base64):", rsaEncrypted)
console.log("Decrypted:", rsaDecrypted)
